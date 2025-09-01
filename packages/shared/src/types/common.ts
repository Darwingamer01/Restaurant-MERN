export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      reservationReminders: boolean;
      promotions: boolean;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'special';
  cuisine: 'indian' | 'chinese' | 'continental' | 'italian' | 'mexican' | 'thai';
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot' | 'very-hot';
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  images: string[];
  isAvailable: boolean;
  isSpecial: boolean;
  tags: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  _id: string;
  userId: string;
  user?: User;
  date: string;
  time: string;
  guests: number;
  occasion?: 'birthday' | 'anniversary' | 'business' | 'date' | 'family' | 'other';
  specialRequests?: string;
  contactPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  tableNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  user?: User;
  dishId?: string;
  dish?: Dish;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  visitDate: string;
  wouldRecommend: boolean;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: {
    message: string;
    respondedBy: string;
    respondedAt: string;
  };
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  perUserLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories: ('appetizer' | 'main' | 'dessert' | 'beverage' | 'special')[];
  excludedDishes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
