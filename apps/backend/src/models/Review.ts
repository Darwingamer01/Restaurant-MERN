import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: string;
  dishId?: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  visitDate: Date;
  wouldRecommend: boolean;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: {
    message: string;
    respondedBy: string;
    respondedAt: Date;
  };
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  dishId: {
    type: Schema.Types.ObjectId,
    ref: 'Dish'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  images: [{
    type: String
  }],
  visitDate: {
    type: Date,
    required: [true, 'Visit date is required'],
    validate: {
      validator: function(value: Date) {
        return value <= new Date();
      },
      message: 'Visit date cannot be in the future'
    }
  },
  wouldRecommend: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminResponse: {
    message: {
      type: String,
      maxlength: [500, 'Admin response cannot exceed 500 characters']
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: {
      type: Date
    }
  },
  helpfulCount: {
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

// Index for efficient querying
ReviewSchema.index({ dishId: 1, status: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ rating: 1, status: 1 });

// Update dish rating after review save/update
ReviewSchema.post('save', async function(doc) {
  if (doc.status === 'approved' && doc.dishId) {
    await updateDishRating(doc.dishId.toString());
  }
});

ReviewSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && doc.status === 'approved' && doc.dishId) {
    await updateDishRating(doc.dishId.toString());
  }
});

// Helper function to update dish rating
async function updateDishRating(dishId: string) {
  const reviews = await mongoose.model('Review').find({
    dishId,
    status: 'approved'
  });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await mongoose.model('Dish').findByIdAndUpdate(dishId, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    });
  }
}

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
