import { z } from 'zod';

export const ReviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment cannot exceed 1000 characters'),
  images: z.array(z.string().url()).max(5, 'Maximum 5 images allowed').default([]),
  visitDate: z.string().refine((date) => {
    const visitDate = new Date(date);
    const today = new Date();
    return visitDate <= today;
  }, 'Visit date cannot be in the future'),
  dishId: z.string().optional(),
  wouldRecommend: z.boolean().default(true)
});

export const UpdateReviewSchema = ReviewSchema.partial();

export const ReviewResponseSchema = z.object({
  response: z.string().min(10, 'Response must be at least 10 characters').max(500, 'Response cannot exceed 500 characters')
});

export type ReviewInput = z.infer<typeof ReviewSchema>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewSchema>;
export type ReviewResponseInput = z.infer<typeof ReviewResponseSchema>;
