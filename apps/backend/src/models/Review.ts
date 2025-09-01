import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  dishId?: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  response?: {
    text: string;
    respondedBy: mongoose.Types.ObjectId;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dishId: {
    type: Schema.Types.ObjectId,
    ref: 'Dish',
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  response: {
    text: {
      type: String,
      maxlength: 300,
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    respondedAt: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
});

// Indexes
reviewSchema.index({ userId: 1 });
reviewSchema.index({ dishId: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ rating: 1 });

// One review per user per dish
reviewSchema.index({ userId: 1, dishId: 1 }, { unique: true, sparse: true });

export const ReviewModel = mongoose.model<IReview>('Review', reviewSchema);
