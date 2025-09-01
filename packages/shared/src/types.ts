import { z } from 'zod';

// User Schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['customer', 'admin']),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional()
});

// Dish Schemas
export const DishSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  category: z.enum(['appetizer', 'main', 'dessert', 'beverage']),
  image: z.string().url(),
  isVeg: z.boolean(),
  isAvailable: z.boolean().default(true),
  ingredients: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Reservation Schemas
export const ReservationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  time: z.string(),
  guests: z.number().min(1).max(20),
  specialRequests: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Order Schemas
export const OrderItemSchema = z.object({
  dishId: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive()
});

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(OrderItemSchema),
  subtotal: z.number().positive(),
  tax: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().positive(),
  couponCode: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
  paymentId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Coupon Schema
export const CouponSchema = z.object({
  id: z.string(),
  code: z.string().min(3),
  description: z.string(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().positive().optional(),
  usedCount: z.number().nonnegative().default(0),
  isActive: z.boolean().default(true),
  validFrom: z.date(),
  validUntil: z.date(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Review Schema
export const ReviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  dishId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10),
  isApproved: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional()
});

// Export TypeScript types
export type User = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type Dish = z.infer<typeof DishSchema>;
export type Reservation = z.infer<typeof ReservationSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Coupon = z.infer<typeof CouponSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & { data?: T };
