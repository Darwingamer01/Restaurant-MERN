import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';
import { Dish } from '../models/Dish';
import { Coupon } from '../models/Coupon';
import { Review } from '../models/Review';

dotenv.config();

const seedData = async () => {
  try {
    await connectDatabase();
    
    // Clear existing data
    await User.deleteMany({});
    await Dish.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});
    
    console.log('Existing data cleared');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@restaurant.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
      phone: '9876543210'
    });
    
    // Create sample users
    const users = await User.create([
      {
        name: 'Raj Patel',
        email: 'raj.patel@example.com',
        password: 'user123456',
        phone: '9876543211',
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            reservationReminders: true,
            promotions: true
          }
        }
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        password: 'user123456',
        phone: '9876543212',
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false,
            reservationReminders: true,
            promotions: false
          }
        }
      },
      {
        name: 'Arjun Singh',
        email: 'arjun.singh@example.com',
        password: 'user123456',
        phone: '9876543213'
      }
    ]);

    console.log(`Created ${users.length + 1} users (including admin)`);

    // Sample dishes with realistic Indian restaurant data
    const dishes = await Dish.create([
      // Appetizers
      {
        name: 'Paneer Tikka',
        description: 'Marinated cottage cheese cubes grilled to perfection with bell peppers and onions, served with mint chutney',
        price: 280,
        category: 'appetizer',
        cuisine: 'indian',
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        spiceLevel: 'medium',
        preparationTime: 20,
        ingredients: ['Paneer', 'Bell Peppers', 'Onions', 'Yogurt', 'Ginger-Garlic Paste', 'Garam Masala', 'Cumin Powder'],
        allergens: ['Dairy'],
        nutritionalInfo: {
          calories: 320,
          protein: 18,
          carbs: 12,
          fat: 22
        },
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sample_dishes/paneer_tikka.jpg'],
        isAvailable: true,
        isSpecial: true,
        tags: ['grilled', 'vegetarian', 'popular'],
        averageRating: 4.5,
        totalReviews: 24
      },
      {
        name: 'Chicken Wings',
        description: 'Spicy buffalo chicken wings served with ranch dip and celery sticks',
        price: 320,
        category: 'appetizer',
        cuisine: 'continental',
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        spiceLevel: 'hot',
        preparationTime: 25,
        ingredients: ['Chicken Wings', 'Buffalo Sauce', 'Celery', 'Ranch Dressing', 'Blue Cheese'],
        allergens: ['Dairy', 'Gluten'],
        nutritionalInfo: {
          calories: 450,
          protein: 28,
          carbs: 8,
          fat: 35
        },
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sample_dishes/chicken_wings.jpg'],
        isAvailable: true,
        tags: ['spicy', 'non-vegetarian', 'party-favorite']
      },
      
      // Main Courses
      {
        name: 'Butter Chicken',
        description: 'Tender chicken pieces cooked in rich tomato-based creamy gravy with aromatic spices',
        price: 420,
        category: 'main',
        cuisine: 'indian',
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        spiceLevel: 'mild',
        preparationTime: 30,
        ingredients: ['Chicken', 'Tomatoes', 'Cream', 'Butter', 'Onions', 'Ginger-Garlic Paste', 'Garam Masala', 'Kasuri Methi'],
        allergens: ['Dairy'],
        nutritionalInfo: {
          calories: 480,
          protein: 32,
          carbs: 15,
          fat: 32
        },
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sample_dishes/butter_chicken.jpg'],
        isAvailable: true,
        isSpecial: true,
        tags: ['creamy', 'non-vegetarian', 'signature-dish'],
        averageRating: 4.8,
        totalReviews: 42
      },
      {
        name: 'Dal Makhani',
        description: 'Black lentils slow-cooked with butter, cream and aromatic spices for hours to achieve the perfect texture',
        price: 280,
        category: 'main',
        cuisine: 'indian',
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        spiceLevel: 'mild',
        preparationTime: 45,
        ingredients: ['Black Lentils', 'Kidney Beans', 'Butter', 'Cream', 'Tomatoes', 'Ginger-Garlic Paste', 'Cumin'],
        allergens: ['Dairy'],
        nutritionalInfo: {
          calories: 350,
          protein: 16,
          carbs: 38,
          fat: 18
        },
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sample_dishes/dal_makhani.jpg'],
        isAvailable: true,
        tags: ['vegetarian', 'comfort-food', 'rich'],
        averageRating: 4.6,
        totalReviews: 38
      },
      {
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil leaves on thin crust',
        price: 380,
        category: 'main',
        cuisine: 'italian',
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        spiceLevel: 'mild',
        preparationTime: 18,
        ingredients: ['Pizza Dough', 'Mozzarella Cheese', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
        allergens: ['Gluten', 'Dairy'],
        nutritionalInfo: {
          calories: 420,
          protein: 18,
          carbs: 45,
          fat: 20
        },
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sample_dishes/margherita_pizza.jpg'],
        isAvailable: true,
        tags: ['vegetarian', 'italian', 'classic']
      },

      // Desserts
      {
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings soaked in cardamom-flavored sugar syrup, served warm',
        price: 160,
        category: 'dessert',
        cuisine: 'indian',
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        spiceLevel: 'mild',
        preparationTime: 15,
        ingredients: ['Milk Powder', 'Flour', 'Sugar', 'Cardamom', 'Rose Water', 'Ghee'],
        allergens: ['Dairy', 'Gluten'],
        nutritionalInfo: {
          calories: 280,
          protein: 6,
          carbs: 42,
          fat: 12
        },
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sample_dishes/gulab_jamun.jpg'],
        isAvailable: true,
        tags: ['sweet', 'traditional', 'vegetarian'],
        averageRating: 4.4,
        totalReviews: 31
      },
      {
        name: 'Chocolate Brownie',
        description: 'Rich and fudgy chocolate brownie served with vanilla ice cream and chocolate sauce',
        price: 220,
        category: 'dessert',
        cuisine: 'continental',
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        spiceLevel: 'mild',
        preparationTime: 12,
        ingredients: ['Dark Chocolate', 'Butter', 'Sugar', 'Eggs', 'Flour', 'Vanilla Ice Cream'],
        allergens: ['Eggs', 'Dairy', 'Gluten'],
        nutritionalInfo: {
          calories: 380,
          protein: 8,
          carbs: 48,
          fat: 18
        },
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sample_dishes/chocolate_brownie.jpg'],
        isAvailable: true,
        tags: ['chocolate', 'dessert', 'indulgent']
      },

      // Beverages
      {
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea brewed with cardamom, ginger, and aromatic spices',
        price: 80,
        category: 'beverage',
        cuisine: 'indian',
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        spiceLevel: 'mild',
        preparationTime: 8,
        ingredients: ['Black Tea', 'Milk', 'Sugar', 'Cardamom', 'Ginger', 'Cinnamon', 'Cloves'],
        allergens: ['Dairy'],
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sample_dishes/masala_chai.jpg'],
        isAvailable: true,
        tags: ['hot', 'traditional', 'aromatic'],
        averageRating: 4.2,
        totalReviews: 15
      },
      {
        name: 'Fresh Lime Soda',
        description: 'Refreshing lime drink with soda water, perfect for hot weather',
        price: 120,
        category: 'beverage',
        cuisine: 'indian',
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        spiceLevel: 'mild',
        preparationTime: 5,
        ingredients: ['Fresh Lime Juice', 'Soda Water', 'Salt', 'Sugar', 'Black Salt', 'Mint'],
        allergens: [],
        nutritionalInfo: {
          calories: 45,
          protein: 0,
          carbs: 12,
          fat: 0
        },
        images: ['https://res.cloudinary.com/demo/image/upload/v1/sample_dishes/lime_soda.jpg'],
        isAvailable: true,
        tags: ['refreshing', 'cold', 'healthy']
      }
    ]);

    console.log(`Created ${dishes.length} dishes`);

    // Create sample coupons
    const coupons = await Coupon.create([
      {
        code: 'WELCOME10',
        description: 'Welcome offer for new customers - 10% off on orders above ₹500',
        type: 'percentage',
        value: 10,
        minOrderAmount: 500,
        maxDiscountAmount: 200,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        usageLimit: 1000,
        perUserLimit: 1,
        usedCount: 45
      },
      {
        code: 'FLAT100',
        description: 'Flat ₹100 off on orders above ₹800',
        type: 'fixed',
        value: 100,
        minOrderAmount: 800,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        usageLimit: 500,
        perUserLimit: 2,
        usedCount: 123
      },
      {
        code: 'DESSERT20',
        description: '20% off on all desserts - sweet deals!',
        type: 'percentage',
        value: 20,
        minOrderAmount: 200,
        maxDiscountAmount: 150,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        usageLimit: 200,
        perUserLimit: 3,
        usedCount: 67,
        applicableCategories: ['dessert']
      }
    ]);

    console.log(`Created ${coupons.length} coupons`);

    // Create sample reviews
    const reviews = await Review.create([
      {
        userId: users[0]._id,
        dishId: dishes[0]._id, // Paneer Tikka
        rating: 5,
        title: 'Absolutely Delicious!',
        comment: 'The paneer tikka was perfectly grilled and the marinade was spot on. The mint chutney complemented it beautifully. Will definitely order again!',
        visitDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        wouldRecommend: true,
        status: 'approved',
        helpfulCount: 12
      },
      {
        userId: users[1]._id,
        dishId: dishes[2]._id, // Butter Chicken
        rating: 5,
        title: 'Best Butter Chicken in Town',
        comment: 'Creamy, rich, and perfectly spiced. The chicken was tender and the gravy was heavenly. This is exactly what butter chicken should taste like.',
        visitDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        wouldRecommend: true,
        status: 'approved',
        helpfulCount: 18,
        adminResponse: {
          message: 'Thank you for your wonderful feedback! We\'re thrilled you enjoyed our signature dish.',
          respondedBy: adminUser._id,
          respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      },
      {
        userId: users[2]._id,
        dishId: dishes[3]._id, // Dal Makhani
        rating: 4,
        title: 'Rich and Flavorful',
        comment: 'The dal makhani was rich and creamy. You can taste the hours of slow cooking. Maybe a bit too heavy for some, but perfect comfort food.',
        visitDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        wouldRecommend: true,
        status: 'approved',
        helpfulCount: 8
      },
      {
        userId: users[0]._id,
        dishId: dishes[5]._id, // Gulab Jamun
        rating: 4,
        title: 'Sweet Ending',
        comment: 'Perfect way to end the meal. The gulab jamuns were soft and the syrup had the right amount of cardamom flavor.',
        visitDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        wouldRecommend: true,
        status: 'approved',
        helpfulCount: 5
      }
    ]);

    console.log(`Created ${reviews.length} reviews`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`• Users: ${users.length + 1} (including 1 admin)`);
    console.log(`• Dishes: ${dishes.length}`);
    console.log(`• Coupons: ${coupons.length}`);
    console.log(`• Reviews: ${reviews.length}`);
    
    console.log('\n🔐 Admin Credentials:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123456'}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await disconnectDatabase();
  }
};

// Run seed if called directly
if (require.main === module) {
  seedData();
}

export { seedData };
