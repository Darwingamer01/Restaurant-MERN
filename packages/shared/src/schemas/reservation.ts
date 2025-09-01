import { z } from 'zod';

export const ReservationSchema = z.object({
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

export const UpdateReservationSchema = ReservationSchema.partial();

export type ReservationInput = z.infer<typeof ReservationSchema>;
export type UpdateReservationInput = z.infer<typeof UpdateReservationSchema>;
