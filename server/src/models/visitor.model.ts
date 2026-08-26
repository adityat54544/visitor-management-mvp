import { Schema, model, type InferSchemaType } from 'mongoose';

const statuses = ['expected', 'checked-in', 'checked-out'] as const;

const visitorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    personToMeet: { type: String, trim: true, default: '' },
    purpose: { type: String, trim: true, default: '' },
    status: { type: String, enum: statuses, default: 'expected', index: true },
    expectedTime: { type: Date, default: null },
    checkInTime: { type: Date, default: null },
    checkOutTime: { type: Date, default: null },
    registeredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

visitorSchema.index({ checkInTime: 1 });

export type VisitorStatus = (typeof statuses)[number];
export type Visitor = InferSchemaType<typeof visitorSchema> & { _id: string };

export const VisitorModel = model('Visitor', visitorSchema);