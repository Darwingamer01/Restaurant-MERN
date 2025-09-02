import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["customer", "admin"]>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name: string;
    role: "customer" | "admin";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    phone?: string | undefined;
}, {
    id: string;
    email: string;
    name: string;
    role: "customer" | "admin";
    createdAt: Date;
    updatedAt: Date;
    phone?: string | undefined;
    isActive?: boolean | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    password: string;
    phone?: string | undefined;
}, {
    email: string;
    name: string;
    password: string;
    phone?: string | undefined;
}>;
export declare const DishSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    category: z.ZodEnum<["appetizer", "main", "dessert", "beverage"]>;
    image: z.ZodString;
    isVeg: z.ZodBoolean;
    isAvailable: z.ZodDefault<z.ZodBoolean>;
    ingredients: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    preparationTime: z.ZodNumber;
    spiceLevel: z.ZodEnum<["mild", "medium", "hot", "very_hot"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    price: number;
    category: "appetizer" | "main" | "dessert" | "beverage";
    image: string;
    isVeg: boolean;
    isAvailable: boolean;
    preparationTime: number;
    spiceLevel: "mild" | "medium" | "hot" | "very_hot";
    ingredients?: string[] | undefined;
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    price: number;
    category: "appetizer" | "main" | "dessert" | "beverage";
    image: string;
    isVeg: boolean;
    preparationTime: number;
    spiceLevel: "mild" | "medium" | "hot" | "very_hot";
    isAvailable?: boolean | undefined;
    ingredients?: string[] | undefined;
}>;
export declare const CreateDishSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    category: z.ZodEnum<["appetizer", "main", "dessert", "beverage"]>;
    image: z.ZodString;
    isVeg: z.ZodBoolean;
    ingredients: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    preparationTime: z.ZodNumber;
    spiceLevel: z.ZodDefault<z.ZodEnum<["mild", "medium", "hot", "very_hot"]>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    price: number;
    category: "appetizer" | "main" | "dessert" | "beverage";
    image: string;
    isVeg: boolean;
    preparationTime: number;
    spiceLevel: "mild" | "medium" | "hot" | "very_hot";
    ingredients?: string[] | undefined;
}, {
    name: string;
    description: string;
    price: number;
    category: "appetizer" | "main" | "dessert" | "beverage";
    image: string;
    isVeg: boolean;
    preparationTime: number;
    ingredients?: string[] | undefined;
    spiceLevel?: "mild" | "medium" | "hot" | "very_hot" | undefined;
}>;
export declare const ReservationSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    date: z.ZodDate;
    time: z.ZodString;
    guests: z.ZodNumber;
    tableNumber: z.ZodOptional<z.ZodNumber>;
    specialRequests: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "confirmed", "cancelled", "completed"]>;
    customerName: z.ZodString;
    customerPhone: z.ZodString;
    customerEmail: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    time: string;
    guests: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    tableNumber?: number | undefined;
    specialRequests?: string | undefined;
}, {
    id: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    time: string;
    guests: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    tableNumber?: number | undefined;
    specialRequests?: string | undefined;
}>;
export declare const CreateReservationSchema: z.ZodObject<{
    date: z.ZodString;
    time: z.ZodString;
    guests: z.ZodNumber;
    specialRequests: z.ZodOptional<z.ZodString>;
    customerName: z.ZodString;
    customerPhone: z.ZodString;
    customerEmail: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    time: string;
    guests: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    specialRequests?: string | undefined;
}, {
    date: string;
    time: string;
    guests: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    specialRequests?: string | undefined;
}>;
export declare const OrderItemSchema: z.ZodObject<{
    dishId: z.ZodString;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
    dishName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    price: number;
    dishId: string;
    quantity: number;
    dishName: string;
}, {
    price: number;
    dishId: string;
    quantity: number;
    dishName: string;
}>;
export declare const OrderSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        dishId: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
        dishName: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        price: number;
        dishId: string;
        quantity: number;
        dishName: string;
    }, {
        price: number;
        dishId: string;
        quantity: number;
        dishName: string;
    }>, "many">;
    subtotal: z.ZodNumber;
    tax: z.ZodNumber;
    discount: z.ZodNumber;
    total: z.ZodNumber;
    couponCode: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"]>;
    paymentStatus: z.ZodEnum<["pending", "paid", "failed", "refunded"]>;
    paymentId: z.ZodOptional<z.ZodString>;
    customerDetails: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        email: z.ZodString;
        address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        phone: string;
        address?: string | undefined;
    }, {
        email: string;
        name: string;
        phone: string;
        address?: string | undefined;
    }>;
    estimatedDeliveryTime: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "pending" | "confirmed" | "cancelled" | "preparing" | "ready" | "delivered";
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    items: {
        price: number;
        dishId: string;
        quantity: number;
        dishName: string;
    }[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    customerDetails: {
        email: string;
        name: string;
        phone: string;
        address?: string | undefined;
    };
    couponCode?: string | undefined;
    paymentId?: string | undefined;
    estimatedDeliveryTime?: Date | undefined;
}, {
    id: string;
    status: "pending" | "confirmed" | "cancelled" | "preparing" | "ready" | "delivered";
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    items: {
        price: number;
        dishId: string;
        quantity: number;
        dishName: string;
    }[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    customerDetails: {
        email: string;
        name: string;
        phone: string;
        address?: string | undefined;
    };
    couponCode?: string | undefined;
    paymentId?: string | undefined;
    estimatedDeliveryTime?: Date | undefined;
}>;
export declare const CreateOrderSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        dishId: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        dishId: string;
        quantity: number;
    }, {
        dishId: string;
        quantity: number;
    }>, "many">;
    couponCode: z.ZodOptional<z.ZodString>;
    customerDetails: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        email: z.ZodString;
        address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        phone: string;
        address?: string | undefined;
    }, {
        email: string;
        name: string;
        phone: string;
        address?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    items: {
        dishId: string;
        quantity: number;
    }[];
    customerDetails: {
        email: string;
        name: string;
        phone: string;
        address?: string | undefined;
    };
    couponCode?: string | undefined;
}, {
    items: {
        dishId: string;
        quantity: number;
    }[];
    customerDetails: {
        email: string;
        name: string;
        phone: string;
        address?: string | undefined;
    };
    couponCode?: string | undefined;
}>;
export declare const CouponSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    description: z.ZodString;
    discountType: z.ZodEnum<["percentage", "fixed"]>;
    discountValue: z.ZodNumber;
    minOrderAmount: z.ZodOptional<z.ZodNumber>;
    maxDiscount: z.ZodOptional<z.ZodNumber>;
    usageLimit: z.ZodOptional<z.ZodNumber>;
    usedCount: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    validFrom: z.ZodDate;
    validUntil: z.ZodDate;
    applicableCategories: z.ZodOptional<z.ZodArray<z.ZodEnum<["appetizer", "main", "dessert", "beverage"]>, "many">>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    code: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    usedCount: number;
    validFrom: Date;
    validUntil: Date;
    minOrderAmount?: number | undefined;
    maxDiscount?: number | undefined;
    usageLimit?: number | undefined;
    applicableCategories?: ("appetizer" | "main" | "dessert" | "beverage")[] | undefined;
}, {
    id: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    validFrom: Date;
    validUntil: Date;
    isActive?: boolean | undefined;
    minOrderAmount?: number | undefined;
    maxDiscount?: number | undefined;
    usageLimit?: number | undefined;
    usedCount?: number | undefined;
    applicableCategories?: ("appetizer" | "main" | "dessert" | "beverage")[] | undefined;
}>;
export declare const ValidateCouponSchema: z.ZodObject<{
    code: z.ZodString;
    orderAmount: z.ZodNumber;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["appetizer", "main", "dessert", "beverage"]>;
    }, "strip", z.ZodTypeAny, {
        category: "appetizer" | "main" | "dessert" | "beverage";
    }, {
        category: "appetizer" | "main" | "dessert" | "beverage";
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    code: string;
    orderAmount: number;
    items?: {
        category: "appetizer" | "main" | "dessert" | "beverage";
    }[] | undefined;
}, {
    code: string;
    orderAmount: number;
    items?: {
        category: "appetizer" | "main" | "dessert" | "beverage";
    }[] | undefined;
}>;
export declare const ReviewSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    dishId: z.ZodOptional<z.ZodString>;
    orderId: z.ZodOptional<z.ZodString>;
    rating: z.ZodNumber;
    comment: z.ZodString;
    isApproved: z.ZodDefault<z.ZodBoolean>;
    response: z.ZodOptional<z.ZodObject<{
        text: z.ZodString;
        respondedBy: z.ZodString;
        respondedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        text: string;
        respondedBy: string;
        respondedAt: Date;
    }, {
        text: string;
        respondedBy: string;
        respondedAt: Date;
    }>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    rating: number;
    comment: string;
    isApproved: boolean;
    dishId?: string | undefined;
    orderId?: string | undefined;
    response?: {
        text: string;
        respondedBy: string;
        respondedAt: Date;
    } | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    rating: number;
    comment: string;
    dishId?: string | undefined;
    orderId?: string | undefined;
    isApproved?: boolean | undefined;
    response?: {
        text: string;
        respondedBy: string;
        respondedAt: Date;
    } | undefined;
}>;
export declare const CreateReviewSchema: z.ZodObject<{
    dishId: z.ZodOptional<z.ZodString>;
    orderId: z.ZodOptional<z.ZodString>;
    rating: z.ZodNumber;
    comment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rating: number;
    comment: string;
    dishId?: string | undefined;
    orderId?: string | undefined;
}, {
    rating: number;
    comment: string;
    dishId?: string | undefined;
    orderId?: string | undefined;
}>;
export declare const ApiResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodString>;
    errors: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
}, "strip", z.ZodTypeAny, {
    message: string;
    success: boolean;
    data?: any;
    error?: string | undefined;
    errors?: any[] | undefined;
}, {
    message: string;
    success: boolean;
    data?: any;
    error?: string | undefined;
    errors?: any[] | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type Dish = z.infer<typeof DishSchema>;
export type CreateDish = z.infer<typeof CreateDishSchema>;
export type Reservation = z.infer<typeof ReservationSchema>;
export type CreateReservation = z.infer<typeof CreateReservationSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Coupon = z.infer<typeof CouponSchema>;
export type ValidateCoupon = z.infer<typeof ValidateCouponSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type CreateReview = z.infer<typeof CreateReviewSchema>;
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & {
    data?: T;
};
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
}
export declare const BillSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    orderId: z.ZodString;
    amount: z.ZodNumber;
    tax: z.ZodNumber;
    tip: z.ZodOptional<z.ZodNumber>;
    total: z.ZodNumber;
    paymentStatus: z.ZodEnum<["pending", "paid", "failed", "refunded"]>;
    paymentMethod: z.ZodEnum<["cash", "card", "upi"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    tax: number;
    total: number;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    orderId: string;
    amount: number;
    paymentMethod: "cash" | "card" | "upi";
    tip?: number | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    tax: number;
    total: number;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    orderId: string;
    amount: number;
    paymentMethod: "cash" | "card" | "upi";
    tip?: number | undefined;
}>;
export type Bill = z.infer<typeof BillSchema>;
export declare const ChefSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    specialty: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    experienceYears: z.ZodNumber;
    image: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    specialty: string;
    experienceYears: number;
    image?: string | undefined;
    bio?: string | undefined;
}, {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    specialty: string;
    experienceYears: number;
    isActive?: boolean | undefined;
    image?: string | undefined;
    bio?: string | undefined;
}>;
export type Chef = z.infer<typeof ChefSchema>;
export declare const ContactSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    subject: z.ZodString;
    message: z.ZodString;
    createdAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    name: string;
    message: string;
    createdAt: Date;
    subject: string;
    phone?: string | undefined;
}, {
    id: string;
    email: string;
    name: string;
    message: string;
    createdAt: Date;
    subject: string;
    phone?: string | undefined;
}>;
export type Contact = z.infer<typeof ContactSchema>;
//# sourceMappingURL=types.d.ts.map