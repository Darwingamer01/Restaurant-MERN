import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  guests: number;
  tableNumber?: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(date: Date) {
        return date >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      message: 'Reservation date cannot be in the past',
    },
  },
  time: {
    type: String,
    required: true,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'],
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  tableNumber: {
    type: Number,
    min: 1,
    max: 50,
  },
  specialRequests: {
    type: String,
    maxlength: 200,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'],
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
}, {
  timestamps: true,
});

// Indexes
reservationSchema.index({ userId: 1 });
reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ status: 1 });

// Prevent double booking
reservationSchema.index({ date: 1, time: 1, tableNumber: 1 }, { unique: true, sparse: true });

export const ReservationModel = mongoose.model<IReservation>('Reservation', reservationSchema);
