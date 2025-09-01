import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import dotenv from 'dotenv';

// Load environment variables with explicit path
dotenv.config({ path: '../../.env' });

// Debug output
console.log('=== ENVIRONMENT DEBUG ===');
console.log('Working directory:', process.cwd());
console.log('MONGO_URI:', process.env.MONGO_URI ? 'LOADED ✅' : 'MISSING ❌');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED ✅' : 'MISSING ❌');
console.log('========================');

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is required');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await UserModel.deleteMany({});
    console.log('Cleared existing users');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    const adminUser = new UserModel({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');

    console.log('Seed data completed');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
