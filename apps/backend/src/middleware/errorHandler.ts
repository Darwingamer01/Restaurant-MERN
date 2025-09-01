import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export const errorHandler = (error: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  const errors = error.errors;

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  // Mongoose duplicate key error
  if ((error as any).code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    statusCode
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    statusCode: 404
  });
};
