import type { Request, Response, NextFunction } from 'express';
import { VisitorModel } from '../models/visitor.model.js';

// GET /api/reports/summary?from=&to=&status=
export async function getReport(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { from, to, status } = req.query as {
      from?: string;
      to?: string;
      status?: string;
    };

    const inFrom = from ? new Date(from) : new Date(new Date().setHours(0, 0, 0, 0));
    const inTo = to ? new Date(to) : new Date();
    if (isNaN(inFrom.getTime()) || isNaN(inTo.getTime())) {
      res.status(400).json({ success: false, message: 'Invalid date range' });
      return;
    }

    // date filters on check-in/check-out/expected time
    const dateRange = {
      $or: [
        { checkInTime: { $gte: inFrom, $lte: inTo } },
        { checkOutTime: { $gte: inFrom, $lte: inTo } },
        { expectedTime: { $gte: inFrom, $lte: inTo } },
      ],
    };

    const statusFilter =
      status && ['expected', 'checked-in', 'checked-out'].includes(status)
        ? { status }
        : null;

    const base = statusFilter ? { $and: [dateRange, statusFilter] } : dateRange;

    const [totals] = await VisitorModel.aggregate([
      { $match: base },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          checkedIn: { $sum: { $cond: [{ $eq: ['$status', 'checked-in'] }, 1, 0] } },
          checkedOut: { $sum: { $cond: [{ $eq: ['$status', 'checked-out'] }, 1, 0] } },
          expected: { $sum: { $cond: [{ $eq: ['$status', 'expected'] }, 1, 0] } },
        },
      },
    ]);

    const byPurpose = await VisitorModel.aggregate([
      { $match: base },
      { $group: { _id: '$purpose', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byCompany = await VisitorModel.aggregate([
      { $match: { ...dateRange, company: { $ne: '' } } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    const byHost = await VisitorModel.aggregate([
      { $match: { ...dateRange, personToMeet: { $ne: '' } } },
      { $group: { _id: '$personToMeet', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const daily = await VisitorModel.aggregate([
      {
        $match: {
          checkInTime: { $gte: inFrom, $lte: inTo, $ne: null },
          ...statusFilter,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$checkInTime' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const visits = await VisitorModel.find(base)
      .sort({ checkInTime: -1, createdAt: -1 })
      .limit(200)
      .lean();

    res.json({
      success: true,
      data: {
        from: inFrom,
        to: inTo,
        totals: totals ?? { total: 0, checkedIn: 0, checkedOut: 0, expected: 0 },
        byPurpose,
        byCompany,
        byHost,
        daily,
        visits,
      },
    });
  } catch (err) {
    next(err);
  }
}