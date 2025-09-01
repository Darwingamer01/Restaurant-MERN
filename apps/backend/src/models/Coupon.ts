import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  applicableCategories?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  description: {
    type: String,
    required: true,
    maxlength: 200,
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(this: ICoupon, value: number) {
        if (this.discountType === 'percentage') {
          return value <= 100;
        }
        return true;
      },
      message: 'Percentage discount cannot exceed 100%',
    },
  },
  minOrderAmount: {
    type: Number,
    min: 0,
  },
  maxDiscount: {
    type: Number,
    min: 0,
  },
  usageLimit: {
    type: Number,
    min: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
    validate: {
      validator: function(this: ICoupon, value: Date) {
        return value > this.validFrom;
      },
      message: 'Valid until date must be after valid from date',
    },
  },
  applicableCategories: [{
    type: String,
    enum: ['appetizer', 'main', 'dessert', 'beverage'],
  }],
}, {
  timestamps: true,
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });

export const CouponModel = mongoose.model<ICoupon>('Coupon', couponSchema);
