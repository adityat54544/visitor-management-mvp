import type { Request, Response, NextFunction } from 'express';
import { ItemModel, type Item } from '../models/item.model.js';

type ItemInput = Partial<Item> & { name?: string };

// GET /api/items
export async function getItems(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const items = await ItemModel.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

// GET /api/items/:id
export async function getItemById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const item = await ItemModel.findById(req.params.id).lean();
    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

// POST /api/items
export async function createItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as ItemInput;
    if (!body.name) {
      res.status(400).json({ success: false, message: 'name is required' });
      return;
    }
    const item = await ItemModel.create(body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

// PUT /api/items/:id
export async function updateItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as ItemInput;
    const item = await ItemModel.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/items/:id
export async function deleteItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const item = await ItemModel.findByIdAndDelete(req.params.id).lean();
    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}