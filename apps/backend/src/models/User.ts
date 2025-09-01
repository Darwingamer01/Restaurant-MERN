import mongoose, { Schema, Document } from 'mongoose';
import { User } from '@restaurant/shared';

export interface IUser extends Omit<User, 'id'>, Document {
  password: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
