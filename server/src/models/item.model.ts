import { Schema, model, type InferSchemaType } from 'mongoose';

const itemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Item = InferSchemaType<typeof itemSchema>;

export const ItemModel = model('Item', itemSchema);