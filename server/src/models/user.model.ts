import { Schema, model, type InferSchemaType } from 'mongoose';

export const ROLES = ['admin', 'receptionist', 'manager'] as const;
export type UserRole = (typeof ROLES)[number];

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: 'receptionist' },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema> & { _id: string };

export const UserModel = model('User', userSchema);