// server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from "cookie-parser";

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import dishRoutes from './routes/dishes';
import reservationRoutes from './routes/reservations';
import orderRoutes from './routes/orders';
import couponRoutes from './routes/coupons';
import reviewRoutes from './routes/reviews';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

console.log('🚀 Starting backend server...');
console.log('🔍 DEBUG MONGO_URI:', process.env.MONGO_URI ? 'LOADED ✅' : 'MISSING ❌');
console.log('🔍 DEBUG JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED ✅' : 'MISSING ❌');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    },
  },
}));

// Rate limiting
// Rate limiting
if (process.env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, try again later.' },
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Too many auth attempts, try again later.' },
  });

  app.use('/api/', limiter);
  app.use('/api/v1/auth/', authLimiter);
}

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-domain.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dishes', dishRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'Restaurant MERN API is running!',
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    },
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// DB connect util
export const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI required');
  await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log('✅ MongoDB connected');
};

// Only start server if not in test
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/health`);
      console.log('📚 Environment:', process.env.NODE_ENV || 'development');
    });
  }).catch(err => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });
}

export default app;
