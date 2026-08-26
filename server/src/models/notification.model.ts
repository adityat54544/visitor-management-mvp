import { Schema, model, type InferSchemaType } from 'mongoose';

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['check-in', 'check-out', 'system'],
      default: 'system',
    },
    title: { type: String, required: true, trim: true },
    body: { type: String, default: '' },
    read: { type: Boolean, default: false },
    visitorId: { type: Schema.Types.ObjectId, ref: 'Visitor', default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1 });

export type Notification = InferSchemaType<typeof notificationSchema> & {
  _id: string;
};

export const NotificationModel = model('Notification', notificationSchema);