export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  cuisine: 'indian' | 'chinese' | 'continental' | 'italian';
  image: string;
  ingredients: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
  preparationTime: number; // in minutes
  calories?: number;
  isAvailable: boolean;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  _id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  tableNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  dishId?: string;
  dishName?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isApproved: boolean;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableCategories?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Bill {
  _id: string;
  userId?: string;
  items: {
    dishId: string;
    dishName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  couponCode?: string;
  couponDiscount: number;
  taxes: {
    cgst: number;
    sgst: number;
    serviceCharge: number;
  };
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  tableNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chef {
  _id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  speciality: string[];
  experience: number; // years
  awards?: string[];
  socialLinks?: {
    instagram?: string;
    twitter?: string;
  };
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'resolved';
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
