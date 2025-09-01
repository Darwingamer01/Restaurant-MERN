import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { DishModel } from '../models/Dish';
import { CouponModel } from '../models/Coupon';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is required');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await UserModel.deleteMany({});
    await DishModel.deleteMany({});
    await CouponModel.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    const adminUser = new UserModel({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      isActive: true,
    });
    await adminUser.save();
    console.log('Admin user created successfully');

    // Create sample customer
    const customerPassword = await bcrypt.hash('Customer@123', 12);
    const customerUser = new UserModel({
      email: 'customer@example.com',
      password: customerPassword,
      name: 'John Doe',
      phone: '+91 9876543210',
      role: 'customer',
      isActive: true,
    });
    await customerUser.save();
    console.log('Sample customer created successfully');

    // Sample dishes
    const dishes = [
      // Appetizers
      {
        name: 'Chicken Tikka',
        description: 'Tender pieces of chicken marinated in yogurt and spices, grilled to perfection',
        price: 295,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500',
        isVeg: false,
        preparationTime: 20,
        spiceLevel: 'medium',
        ingredients: ['Chicken', 'Yogurt', 'Ginger-Garlic paste', 'Red chili powder', 'Garam masala'],
      },
      {
        name: 'Paneer Tikka',
        description: 'Cubes of paneer marinated in spiced yogurt and grilled with bell peppers',
        price: 275,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500',
        isVeg: true,
        preparationTime: 15,
        spiceLevel: 'mild',
        ingredients: ['Paneer', 'Bell peppers', 'Yogurt', 'Cumin powder', 'Coriander powder'],
      },
      {
        name: 'Samosa Chat',
        description: 'Crispy samosas topped with chutneys, yogurt, and fresh vegetables',
        price: 165,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
        isVeg: true,
        preparationTime: 10,
        spiceLevel: 'medium',
        ingredients: ['Samosa', 'Mint chutney', 'Tamarind chutney', 'Yogurt', 'Onions', 'Tomatoes'],
      },

      // Main Courses
      {
        name: 'Butter Chicken',
        description: 'Creamy tomato-based curry with tender chicken pieces',
        price: 385,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500',
        isVeg: false,
        preparationTime: 30,
        spiceLevel: 'mild',
        ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Butter', 'Garam masala', 'Fenugreek leaves'],
      },
      {
        name: 'Dal Makhani',
        description: 'Rich and creamy black lentils slow-cooked with butter and cream',
        price: 295,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
        isVeg: true,
        preparationTime: 45,
        spiceLevel: 'mild',
        ingredients: ['Black lentils', 'Kidney beans', 'Cream', 'Butter', 'Tomatoes', 'Ginger'],
      },
      {
        name: 'Biryani (Chicken)',
        description: 'Fragrant basmati rice layered with spiced chicken and cooked in dum style',
        price: 425,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=500',
        isVeg: false,
        preparationTime: 50,
        spiceLevel: 'medium',
        ingredients: ['Basmati rice', 'Chicken', 'Saffron', 'Fried onions', 'Mint', 'Coriander'],
      },
      {
        name: 'Palak Paneer',
        description: 'Soft paneer cubes in a creamy spinach gravy',
        price: 315,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500',
        isVeg: true,
        preparationTime: 25,
        spiceLevel: 'mild',
        ingredients: ['Paneer', 'Spinach', 'Cream', 'Onions', 'Tomatoes', 'Cumin'],
      },

      // Desserts
      {
        name: 'Gulab Jamun',
        description: 'Soft, spongy balls made from milk solids, fried and soaked in sugar syrup',
        price: 145,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500',
        isVeg: true,
        preparationTime: 15,
        spiceLevel: 'mild',
        ingredients: ['Milk powder', 'Sugar', 'Cardamom', 'Rose water'],
      },
      {
        name: 'Ras Malai',
        description: 'Soft cottage cheese dumplings in sweetened, thickened milk',
        price: 165,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
        isVeg: true,
        preparationTime: 20,
        spiceLevel: 'mild',
        ingredients: ['Cottage cheese', 'Milk', 'Sugar', 'Cardamom', 'Pistachios'],
      },

      // Beverages
      {
        name: 'Mango Lassi',
        description: 'Refreshing yogurt-based drink blended with fresh mango',
        price: 125,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937d?w=500',
        isVeg: true,
        preparationTime: 5,
        spiceLevel: 'mild',
        ingredients: ['Mango', 'Yogurt', 'Sugar', 'Cardamom'],
      },
      {
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea with milk',
        price: 65,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500',
        isVeg: true,
        preparationTime: 10,
        spiceLevel: 'mild',
        ingredients: ['Tea leaves', 'Milk', 'Ginger', 'Cardamom', 'Cinnamon', 'Cloves'],
      },
      {
        name: 'Fresh Lime Soda',
        description: 'Refreshing lime juice with soda water and mint',
        price: 95,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500',
        isVeg: true,
        preparationTime: 5,
        spiceLevel: 'mild',
        ingredients: ['Fresh lime', 'Soda water', 'Mint', 'Black salt'],
      },
    ];

    await DishModel.insertMany(dishes);
    console.log(`${dishes.length} sample dishes created successfully`);

    // Sample coupons
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome offer - 10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 300,
        maxDiscount: 100,
        usageLimit: 100,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        code: 'SAVE50',
        description: 'Flat ₹50 off on orders above ₹500',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 500,
        usageLimit: 50,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      },
      {
        code: 'WEEKEND20',
        description: 'Weekend special - 20% off (max ₹200)',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 400,
        maxDiscount: 200,
        usageLimit: 25,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        applicableCategories: ['main', 'appetizer'],
      },
    ];

    await CouponModel.insertMany(coupons);
    console.log(`${coupons.length} sample coupons created successfully`);

    console.log('\n🎉 Seed data completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('👤 Admin: admin@example.com / Admin@123');
    console.log('👤 Customer: customer@example.com / Customer@123');
    console.log('\n🍽️ Sample Data:');
    console.log(`• ${dishes.length} dishes across all categories`);
    console.log(`• ${coupons.length} active coupons`);
    console.log('• 2 user accounts (admin + customer)');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
