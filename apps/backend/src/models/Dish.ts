import mongoose, { Document, Schema } from 'mongoose';

export interface IDish extends Document {
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage';
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  ingredients?: string[];
  preparationTime: number; // in minutes
  spiceLevel: 'mild' | 'medium' | 'hot' | 'very_hot';
  createdAt: Date;
  updatedAt: Date;
}

const dishSchema = new Schema<IDish>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'beverage'],
  },
  image: {
    type: String,
    required: true,
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i, 'Please enter a valid image URL'],
  },
  isVeg: {
    type: Boolean,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  ingredients: [{
    type: String,
    trim: true,
  }],
  preparationTime: {
    type: Number,
    required: true,
    min: 5,
    max: 120,
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'very_hot'],
    default: 'mild',
  },
}, {
  timestamps: true,
});

// Indexes
dishSchema.index({ category: 1 });
dishSchema.index({ isAvailable: 1 });
dishSchema.index({ isVeg: 1 });
dishSchema.index({ price: 1 });

export const DishModel = mongoose.model<IDish>('Dish', dishSchema);
