import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

interface RefreshPayload {
  userId: string;
  tokenVersion: number;
}

export const generateAccessToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: '15m',
    issuer: 'restaurant-api',
    audience: 'restaurant-client'
  });
};

export const generateRefreshToken = (payload: RefreshPayload): string => {
  const secret = process.env.REFRESH_SECRET;
  if (!secret) {
    throw new Error('REFRESH_SECRET is not defined');
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: '7d',
    issuer: 'restaurant-api',
    audience: 'restaurant-client'
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  try {
    return jwt.verify(token, secret, {
      issuer: 'restaurant-api',
      audience: 'restaurant-client'
    }) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): RefreshPayload => {
  const secret = process.env.REFRESH_SECRET;
  if (!secret) {
    throw new Error('REFRESH_SECRET is not defined');
  }
  
  try {
    return jwt.verify(token, secret, {
      issuer: 'restaurant-api',
      audience: 'restaurant-client'
    }) as RefreshPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
