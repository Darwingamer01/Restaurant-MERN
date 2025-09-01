import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  userId: string;
  date: Date;
  time: string;
  guests: number;
  occasion?: 'birthday' | 'anniversary' | 'business' | 'date' | 'family' | 'other';
  specialRequests?: string;
  contactPhone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  tableNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Reservation date is required'],
    validate: {
      validator: function(value: Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      },
      message: 'Reservation date cannot be in the past'
    }
  },
  time: {
    type: String,
    required: [true, 'Reservation time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'At least 1 guest is required'],
    max: [20, 'Maximum 20 guests allowed']
  },
  occasion: {
    type: String,
    enum: ['birthday', 'anniversary', 'business', 'date', 'family', 'other']
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  tableNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
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

// Compound index to prevent double booking
ReservationSchema.index({ date: 1, time: 1, tableNumber: 1 });
ReservationSchema.index({ userId: 1, createdAt: -1 });

// Pre-save validation to prevent double booking
ReservationSchema.pre('save', async function(next) {
  if (this.isModified('date') || this.isModified('time') || this.isModified('tableNumber')) {
    if (this.tableNumber && this.status !== 'cancelled') {
      const existingReservation = await mongoose.model('Reservation').findOne({
        _id: { $ne: this._id },
        date: this.date,
        time: this.time,
        tableNumber: this.tableNumber,
        status: { $in: ['pending', 'confirmed'] }
      });

      if (existingReservation) {
        return next(new Error('Table is already reserved for this date and time'));
      }
    }
  }
  next();
});

export const Reservation = mongoose.model<IReservation>('Reservation', ReservationSchema);
