import type { Request, Response, NextFunction } from 'express';
import { VisitorModel, type Visitor } from '../models/visitor.model.js';

type VisitorInput = Partial<Visitor>;

const dayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
const dayEnd = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

// GET /api/visitors/today
export async function getToday(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const from = dayStart();
    const to = dayEnd();
    // any visitor touched today OR still expected for today
    const visitors = await VisitorModel.find({
      $or: [
        {
          $or: [
            { checkInTime: { $gte: from, $lte: to } },
            { checkOutTime: { $gte: from, $lte: to } },
          ],
        },
        { status: 'expected', expectedTime: { $gte: from, $lte: to } },
      ],
    })
      .sort({ checkInTime: -1, createdAt: -1 })
      .lean();

    const counts = {
      checkedIn: visitors.filter((v) => v.status === 'checked-in').length,
      checkedOut: visitors.filter((v) => v.status === 'checked-out').length,
      expected: visitors.filter((v) => v.status === 'expected').length,
    };

    res.json({ success: true, data: { visitors, counts } });
  } catch (err) {
    next(err);
  }
}

// GET /api/visitors?search=&status=
export async function getVisitors(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, status } = req.query as { search?: string; status?: string };
    const query: Record<string, unknown> = {};
    if (status && ['expected', 'checked-in', 'checked-out'].includes(status)) {
      query.status = status;
    }
    if (search && search.trim()) {
      const re = new RegExp(search.trim(), 'i');
      query.$or = [{ name: re }, { company: re }, { phone: re }, { personToMeet: re }];
    }
    const visitors = await VisitorModel.find(query)
      .sort({ status: 1, checkInTime: -1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: visitors });
  } catch (err) {
    next(err);
  }
}

// GET /api/visitors/:id
export async function getVisitorById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const visitor = await VisitorModel.findById(req.params.id).lean();
    if (!visitor) {
      res.status(404).json({ success: false, message: 'Visitor not found' });
      return;
    }
    res.json({ success: true, data: visitor });
  } catch (err) {
    next(err);
  }
}

// POST /api/visitors
export async function createVisitor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as VisitorInput;
    if (!body.name) {
      res.status(400).json({ success: false, message: 'Visitor name is required' });
      return;
    }
    const visitor = await VisitorModel.create({
      ...body,
      status: body.status || 'expected',
      registeredBy: (req as unknown as { userId: string }).userId,
    });
    res.status(201).json({ success: true, data: visitor });
  } catch (err) {
    next(err);
  }
}

// PUT /api/visitors/:id
export async function updateVisitor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as VisitorInput;
    const visitor = await VisitorModel.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!visitor) {
      res.status(404).json({ success: false, message: 'Visitor not found' });
      return;
    }
    res.json({ success: true, data: visitor });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/visitors/:id
export async function deleteVisitor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const visitor = await VisitorModel.findByIdAndDelete(req.params.id).lean();
    if (!visitor) {
      res.status(404).json({ success: false, message: 'Visitor not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// PATCH /api/visitors/:id/check-in
export async function checkInVisitor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const visitor = await VisitorModel.findByIdAndUpdate(
      req.params.id,
      {
        status: 'checked-in',
        checkInTime: req.body?.checkInTime || new Date(),
        $unset: { checkOutTime: 1 },
      },
      { new: true, runValidators: true }
    ).lean();
    if (!visitor) {
      res.status(404).json({ success: false, message: 'Visitor not found' });
      return;
    }
    res.json({ success: true, data: visitor });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/visitors/:id/check-out
export async function checkOutVisitor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const visitor = await VisitorModel.findByIdAndUpdate(
      req.params.id,
      {
        status: 'checked-out',
        checkOutTime: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();
    if (!visitor) {
      res.status(404).json({ success: false, message: 'Visitor not found' });
      return;
    }
    res.json({ success: true, data: visitor });
  } catch (err) {
    next(err);
  }
}