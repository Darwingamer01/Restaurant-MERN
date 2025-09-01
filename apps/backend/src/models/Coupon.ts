import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  perUserLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories: ('appetizer' | 'main' | 'dessert' | 'beverage' | 'special')[];
  excludedDishes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Coupon code must be at least 3 characters'],
    maxlength: [20, 'Coupon code cannot exceed 20 characters'],
    match: [/^[A-Z0-9]+$/, 'Coupon code must contain only uppercase letters and numbers']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    required: [true, 'Coupon type is required'],
    enum: ['percentage', 'fixed']
  },
  value: {
    type: Number,
    required: [true, 'Coupon value is required'],
    min: [0, 'Coupon value cannot be negative'],
    validate: {
      validator: function(this: ICoupon, value: number) {
        if (this.type === 'percentage') {
          return value > 0 && value <= 100;
        }
        return value > 0;
      },
      message: 'Invalid coupon value for the specified type'
    }
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum order amount cannot be negative']
  },
  maxDiscountAmount: {
    type: Number,
    min: [0, 'Maximum discount amount cannot be negative']
  },
  validFrom: {
    type: Date,
    required: [true, 'Valid from date is required']
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required'],
    validate: {
      validator: function(this: ICoupon, value: Date) {
        return value > this.validFrom;
      },
      message: 'Valid until date must be after valid from date'
    }
  },
  usageLimit: {
    type: Number,
    default: 1,
    min: [1, 'Usage limit must be at least 1']
  },
  perUserLimit: {
    type: Number,
    default: 1,
    min: [1, 'Per user limit must be at least 1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: String,
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'special']
  }],
  excludedDishes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dish'
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Index for efficient querying
CouponSchema.index({ code: 1 });
CouponSchema.index({ validFrom: 1, validUntil: 1, isActive: 1 });

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
