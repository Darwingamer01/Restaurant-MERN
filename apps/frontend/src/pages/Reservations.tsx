import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, Phone } from 'lucide-react';

const ReservationSchema = z.object({
  date: z.string().refine((date) => {
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservationDate >= today;
  }, 'Reservation date cannot be in the past'),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  guests: z.number().min(1, 'At least 1 guest required').max(20, 'Maximum 20 guests allowed'),
  occasion: z.enum(['birthday', 'anniversary', 'business', 'date', 'family', 'other']).optional(),
  specialRequests: z.string().max(500, 'Special requests cannot exceed 500 characters').optional(),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
});

type ReservationFormData = z.infer<typeof ReservationSchema>;

const Reservations: React.FC = () => {
  const { user } = useAuth();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReservationFormData>({
    resolver: zodResolver(ReservationSchema)
  });

  // Fetch user reservations
  const { data: reservationsResponse, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const response = await api.get('/reservations');
      return response.data;
    },
    enabled: !!user
  });

  // Create reservation mutation
  const createReservation = useMutation({
    mutationFn: async (data: ReservationFormData) => {
      const response = await api.post('/reservations', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Reservation created successfully!');
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      reset();
      setShowBookingForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create reservation');
    }
  });

  const onSubmit = (data: ReservationFormData) => {
    createReservation.mutate({
      ...data,
      guests: Number(data.guests)
    });
  };

  const reservations = reservationsResponse?.data || [];

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-muted-foreground">You need to be logged in to make reservations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Reservations</h1>
        <p className="text-lg text-muted-foreground">
          Book a table and manage your reservations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <Calendar className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">Available Today</h3>
          <p className="text-2xl font-bold text-primary">12</p>
          <p className="text-sm text-muted-foreground">time slots</p>
        </div>
        <div className="bg-card border rounded-lg p-6 text-center">
          <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">Party Size</h3>
          <p className="text-2xl font-bold text-primary">1-20</p>
          <p className="text-sm text-muted-foreground">guests</p>
        </div>
        <div className="bg-card border rounded-lg p-6 text-center">
          <Clock className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">Operating Hours</h3>
          <p className="text-2xl font-bold text-primary">11-23</p>
          <p className="text-sm text-muted-foreground">daily</p>
        </div>
      </div>

      {/* Book New Reservation */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Make a Reservation</h2>
          {!showBookingForm && (
            <Button onClick={() => setShowBookingForm(true)}>
              Book Table
            </Button>
          )}
        </div>

        {showBookingForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  {...register('date')}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <select
                  {...register('time')}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select time</option>
                  {Array.from({ length: 13 }, (_, i) => {
                    const hour = 11 + i;
                    return ['00', '30'].map(minute => (
                      <option key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
                        {hour}:{minute}
                      </option>
                    ));
                  }).flat()}
                </select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Number of Guests</label>
                <select
                  {...register('guests', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select guests</option>
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
                {errors.guests && (
                  <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Occasion</label>
                <select
                  {...register('occasion')}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select occasion</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="business">Business</option>
                  <option value="date">Date</option>
                  <option value="family">Family</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <input
                {...register('contactPhone')}
                type="tel"
                placeholder="9876543210"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Special Requests</label>
              <textarea
                {...register('specialRequests')}
                rows={3}
                placeholder="Any dietary restrictions or special requirements..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.specialRequests && (
                <p className="text-red-500 text-sm mt-1">{errors.specialRequests.message}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                disabled={createReservation.isPending}
              >
                {createReservation.isPending ? 'Booking...' : 'Confirm Reservation'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowBookingForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Existing Reservations */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Your Reservations</h2>
        
        {isLoading ? (
          <div className="text-center py-8">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reservations found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation: any) => (
              <div 
                key={reservation._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">
                    {new Date(reservation.date).toLocaleDateString('en-IN')} at {reservation.time}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {reservation.guests} guests • {reservation.occasion || 'General dining'}
                  </div>
                  {reservation.specialRequests && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Note: {reservation.specialRequests}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    reservation.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : reservation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;
