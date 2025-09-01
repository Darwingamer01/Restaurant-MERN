import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const dishSchema = z.object({
  name: z.string().min(2, 'Dish name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['appetizer', 'main', 'dessert', 'beverage']),
  cuisine: z.enum(['indian', 'chinese', 'continental', 'italian']),
  image: z.string().url('Invalid image URL'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient required'),
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
  spiceLevel: z.enum(['mild', 'medium', 'hot']),
  preparationTime: z.number().positive('Preparation time must be positive'),
  calories: z.number().positive().optional(),
});

export const reservationSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  date: z.string().refine((date) => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, 'Date must be today or in the future'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  guests: z.number().min(1, 'At least 1 guest required').max(12, 'Maximum 12 guests allowed'),
  specialRequests: z.string().optional(),
});

export const reviewSchema = z.object({
  dishId: z.string().optional(),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive('Value must be positive'),
  minOrderAmount: z.number().min(0, 'Minimum order amount cannot be negative'),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().positive('Usage limit must be positive'),
  validFrom: z.string(),
  validUntil: z.string(),
  applicableCategories: z.array(z.string()).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export const billSchema = z.object({
  items: z.array(z.object({
    dishId: z.string(),
    quantity: z.number().positive('Quantity must be positive'),
  })).min(1, 'At least one item required'),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'online']),
  tableNumber: z.string().optional(),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']),
  notifications: z.boolean(),
});

// Type inference
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type DishData = z.infer<typeof dishSchema>;
export type ReservationData = z.infer<typeof reservationSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;
export type CouponData = z.infer<typeof couponSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type BillData = z.infer<typeof billSchema>;
export type UserPreferencesData = z.infer<typeof userPreferencesSchema>;
