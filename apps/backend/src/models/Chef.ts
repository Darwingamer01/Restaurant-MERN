import mongoose, { Schema, Document } from 'mongoose';
import { Chef as ChefType } from '@restaurant/shared';

export interface IChef extends Omit<ChefType, '_id'>, Document {}

const chefSchema = new Schema<IChef>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  bio: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 1000
  },
  image: {
    type: String,
    required: true
  },
  speciality: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  awards: [{
    type: String
  }],
  socialLinks: {
    instagram: String,
    twitter: String
  }
}, {
  timestamps: true
});

chefSchema.index({ name: 1 });
chefSchema.index({ experience: -1 });

export const Chef = mongoose.model<IChef>('Chef', chefSchema);
