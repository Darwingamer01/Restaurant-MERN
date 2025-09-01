import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';

const ReviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment cannot exceed 1000 characters'),
  visitDate: z.string().refine((date) => {
    const visitDate = new Date(date);
    const today = new Date();
    return visitDate <= today;
  }, 'Visit date cannot be in the future'),
  wouldRecommend: z.boolean().default(true)
});

type ReviewFormData = z.infer<typeof ReviewSchema>;

const Reviews: React.FC = () => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 5,
      wouldRecommend: true
    }
  });

  // Fetch reviews
  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const response = await api.get('/reviews?status=approved');
      return response.data;
    }
  });

  // Create review mutation
  const createReview = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const response = await api.post('/reviews', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Review submitted successfully! It will be published after approval.');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      reset();
      setSelectedRating(5);
      setShowReviewForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  });

  const onSubmit = (data: ReviewFormData) => {
    createReview.mutate({
      ...data,
      rating: selectedRating
    });
  };

  const reviews = reviewsResponse?.data?.items || [];

  const StarRating: React.FC<{ rating: number; onRatingChange?: (rating: number) => void; readonly?: boolean }> = ({ 
    rating, 
    onRatingChange, 
    readonly = false 
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onRatingChange?.(star)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
        <p className="text-lg text-muted-foreground">
          Share your dining experience and read what others say
        </p>
      </div>

      {/* Review Stats */}
      <div className="bg-card border rounded-lg p-6">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">4.8</div>
            <StarRating rating={5} readonly />
            <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">{reviews.length}</div>
            <MessageSquare className="mx-auto h-6 w-6 text-primary mt-1" />
            <p className="text-sm text-muted-foreground mt-1">Total Reviews</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">98%</div>
            <ThumbsUp className="mx-auto h-6 w-6 text-primary mt-1" />
            <p className="text-sm text-muted-foreground mt-1">Recommend</p>
          </div>
        </div>
      </div>

      {/* Write Review */}
      {user && (
        <div className="bg-card border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Write a Review</h2>
            {!showReviewForm && (
              <Button onClick={() => setShowReviewForm(true)}>
                Write Review
              </Button>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <StarRating
                  rating={selectedRating}
                  onRatingChange={(rating) => {
                    setSelectedRating(rating);
                    setValue('rating', rating);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review Title</label>
                <input
                  {...register('title')}
                  placeholder="Summarize your experience..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  {...register('comment')}
                  rows={4}
                  placeholder="Tell us about your dining experience..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Visit Date</label>
                <input
                  {...register('visitDate')}
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.visitDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.visitDate.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...register('wouldRecommend')}
                  type="checkbox"
                  defaultChecked
                  className="form-checkbox"
                />
                <label className="text-sm">I would recommend this restaurant</label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={createReview.isPending}>
                  {createReview.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        
        {isLoading ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review: any) => (
            <div key={review._id} className="bg-card border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {review.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{review.user?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.visitDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
                <StarRating rating={review.rating} readonly />
              </div>

              <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
              <p className="text-muted-foreground mb-4">{review.comment}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {review.wouldRecommend && (
                    <span className="flex items-center text-sm text-green-600">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Recommends
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {review.helpfulCount} found this helpful
                  </span>
                </div>
                
                <Button variant="ghost" size="sm">
                  Helpful
                </Button>
              </div>

              {review.adminResponse && (
                <div className="mt-4 pl-4 border-l-4 border-primary bg-primary/5 p-4 rounded">
                  <p className="font-semibold text-sm">Restaurant Response:</p>
                  <p className="text-sm mt-1">{review.adminResponse.message}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
