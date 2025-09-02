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
    preparationTime: z.number().min(5).max(120),
    spiceLevel: z.enum(['mild', 'medium', 'hot', 'very_hot']),
    createdAt: z.date(),
    updatedAt: z.date()
});
export const CreateDishSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500),
    price: z.number().positive(),
    category: z.enum(['appetizer', 'main', 'dessert', 'beverage']),
    image: z.string().url(),
    isVeg: z.boolean(),
    ingredients: z.array(z.string()).optional(),
    preparationTime: z.number().min(5).max(120),
    spiceLevel: z.enum(['mild', 'medium', 'hot', 'very_hot']).default('mild'),
});
// Reservation Schemas
export const ReservationSchema = z.object({
    id: z.string(),
    userId: z.string(),
    date: z.date(),
    time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    guests: z.number().min(1).max(20),
    tableNumber: z.number().min(1).max(50).optional(),
    specialRequests: z.string().max(200).optional(),
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
    customerName: z.string(),
    customerPhone: z.string(),
    customerEmail: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date()
});
export const CreateReservationSchema = z.object({
    date: z.string().datetime(),
    time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    guests: z.number().min(1).max(20),
    specialRequests: z.string().max(200).optional(),
    customerName: z.string().min(2),
    customerPhone: z.string().regex(/^\+?[\d\s-()]+$/),
    customerEmail: z.string().email(),
});
// Order Schemas
export const OrderItemSchema = z.object({
    dishId: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
    dishName: z.string()
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
    customerDetails: z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string().email(),
        address: z.string().optional(),
    }),
    estimatedDeliveryTime: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});
export const CreateOrderSchema = z.object({
    items: z.array(z.object({
        dishId: z.string(),
        quantity: z.number().positive(),
    })).min(1),
    couponCode: z.string().optional(),
    customerDetails: z.object({
        name: z.string().min(2),
        phone: z.string().regex(/^\+?[\d\s-()]+$/),
        email: z.string().email(),
        address: z.string().optional(),
    }),
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
    applicableCategories: z.array(z.enum(['appetizer', 'main', 'dessert', 'beverage'])).optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});
export const ValidateCouponSchema = z.object({
    code: z.string().min(3),
    orderAmount: z.number().positive(),
    items: z.array(z.object({
        category: z.enum(['appetizer', 'main', 'dessert', 'beverage']),
    })).optional(),
});
// Review Schema
export const ReviewSchema = z.object({
    id: z.string(),
    userId: z.string(),
    dishId: z.string().optional(),
    orderId: z.string().optional(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(10).max(500),
    isApproved: z.boolean().default(false),
    response: z.object({
        text: z.string().max(300),
        respondedBy: z.string(),
        respondedAt: z.date(),
    }).optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});
export const CreateReviewSchema = z.object({
    dishId: z.string().optional(),
    orderId: z.string().optional(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(10).max(500),
});
// API Response Types
export const ApiResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.any().optional(),
    error: z.string().optional(),
    errors: z.array(z.any()).optional()
});
// Bill Schema
export const BillSchema = z.object({
    id: z.string(),
    userId: z.string(),
    orderId: z.string(),
    amount: z.number().positive(),
    tax: z.number().nonnegative(),
    tip: z.number().nonnegative().optional(),
    total: z.number().positive(),
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
    paymentMethod: z.enum(['cash', 'card', 'upi']),
    createdAt: z.date(),
    updatedAt: z.date()
});
// Chef Schema
export const ChefSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    specialty: z.string(),
    bio: z.string().optional(),
    experienceYears: z.number().nonnegative(),
    image: z.string().url().optional(),
    isActive: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date()
});
// Contact Schema
export const ContactSchema = z.object({
    id: z.string(),
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[\d\s-()]+$/).optional(),
    subject: z.string().min(3),
    message: z.string().min(5).max(1000),
    createdAt: z.date()
});
//# sourceMappingURL=types.js.map