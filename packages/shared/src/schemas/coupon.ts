import { z } from 'zod';

export const CouponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').max(20, 'Coupon code cannot exceed 20 characters').regex(/^[A-Z0-9]+$/, 'Coupon code must contain only uppercase letters and numbers'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive('Coupon value must be positive'),
  minOrderAmount: z.number().min(0, 'Minimum order amount cannot be negative').default(0),
  maxDiscountAmount: z.number().positive('Maximum discount amount must be positive').optional(),
  validFrom: z.string().refine((date) => {
    const validFromDate = new Date(date);
    return !isNaN(validFromDate.getTime());
  }, 'Invalid valid from date'),
  validUntil: z.string().refine((date) => {
    const validUntilDate = new Date(date);
    return !isNaN(validUntilDate.getTime());
  }, 'Invalid valid until date'),
  usageLimit: z.number().positive('Usage limit must be positive').default(1),
  perUserLimit: z.number().positive('Per user limit must be positive').default(1),
  isActive: z.boolean().default(true),
  applicableCategories: z.array(z.enum(['appetizer', 'main', 'dessert', 'beverage', 'special'])).default([]),
  excludedDishes: z.array(z.string()).default([])
}).refine((data) => {
  const validFrom = new Date(data.validFrom);
  const validUntil = new Date(data.validUntil);
  return validFrom < validUntil;
}, {
  message: 'Valid until date must be after valid from date',
  path: ['validUntil']
});

export const ApplyCouponSchema = z.object({
  code: z.string(),
  orderAmount: z.number().positive('Order amount must be positive')
});

export type CouponInput = z.infer<typeof CouponSchema>;
export type ApplyCouponInput = z.infer<typeof ApplyCouponSchema>;
