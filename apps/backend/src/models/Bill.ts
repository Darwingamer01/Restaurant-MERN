import mongoose, { Schema, Document } from 'mongoose';
import { Bill as BillType } from '@restaurant/shared';

export interface IBill extends Omit<BillType, '_id'>, Document {}

const billSchema = new Schema<IBill>({
  userId: {
    type: String,
    ref: 'User'
  },
  items: [{
    dishId: {
      type: String,
      required: true,
      ref: 'Dish'
    },
    dishName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  couponCode: {
    type: String,
    uppercase: true
  },
  couponDiscount: {
    type: Number,
    default: 0,
    min: 0
  },
  taxes: {
    cgst: {
      type: Number,
      required: true,
      min: 0
    },
    sgst: {
      type: Number,
      required: true,
      min: 0
    },
    serviceCharge: {
      type: Number,
      required: true,
      min: 0
    }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card', 'upi', 'online']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  tableNumber: {
    type: String
  }
}, {
  timestamps: true
});

billSchema.index({ userId: 1 });
billSchema.index({ paymentStatus: 1 });
billSchema.index({ createdAt: -1 });

export const Bill = mongoose.model<IBill>('Bill', billSchema);
