import mongoose, { Schema, Document } from 'mongoose';
import { Contact as ContactType } from '@restaurant/shared';

export interface IContact extends Omit<ContactType, '_id'>, Document {}

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'replied', 'resolved'],
    default: 'new'
  },
  adminResponse: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

export const Contact = mongoose.model<IContact>('Contact', contactSchema);
