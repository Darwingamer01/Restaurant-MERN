import mongoose, { Document, Schema } from 'mongoose';

export interface IDish extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const DishSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Dish name is required'],
    trim: true,
    minlength: [2, 'Dish name must be at least 2 characters'],
    maxlength: [100, 'Dish name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'special']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine is required'],
    enum: ['indian', 'chinese', 'continental', 'italian', 'mexican', 'thai']
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'very-hot'],
    default: 'mild'
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    trim: true
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 }
  },
  images: [{
    type: String,
    required: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Index for search functionality
DishSchema.index({ name: 'text', description: 'text', tags: 'text' });
DishSchema.index({ category: 1, cuisine: 1, isAvailable: 1 });

export const Dish = mongoose.model<IDish>('Dish', DishSchema);
