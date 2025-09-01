import { Router } from 'express';
import {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  getFeaturedDishes
} from '../controllers/dishController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

// Define schemas directly to avoid import issues
const CreateDishSchema = z.object({
  name: z.string().min(2, 'Dish name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['appetizer', 'main', 'dessert', 'beverage', 'special']),
  cuisine: z.enum(['indian', 'chinese', 'continental', 'italian', 'mexican', 'thai']),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  spiceLevel: z.enum(['mild', 'medium', 'hot', 'very-hot']).default('mild'),
  preparationTime: z.number().positive('Preparation time must be positive'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  allergens: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  isAvailable: z.boolean().default(true),
  isSpecial: z.boolean().default(false),
  tags: z.array(z.string()).default([])
});

const UpdateDishSchema = CreateDishSchema.partial();

const router = Router();

router.get('/', getAllDishes);
router.get('/featured', getFeaturedDishes);
router.get('/:id', getDishById);
router.post('/', authenticate, authorize('admin'), validateRequest(CreateDishSchema), createDish);
router.put('/:id', authenticate, authorize('admin'), validateRequest(UpdateDishSchema), updateDish);
router.delete('/:id', authenticate, authorize('admin'), deleteDish);

export default router;
