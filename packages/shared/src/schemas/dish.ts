import { z } from 'zod';

export const DishSchema = z.object({
  name: z.string().min(2, 'Dish name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['appetizer', 'main', 'dessert', 'beverage', 'special']),
  cuisine: z.enum(['indian', 'chinese', 'continental', 'italian', 'mexican', 'thai']),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  spiceLevel: z.enum(['mild', 'medium', 'hot', 'very-hot']).default('mild'),
  preparationTime: z.number().positive('Preparation time must be positive'), // in minutes
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  allergens: z.array(z.string()).default([]),
  nutritionalInfo: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional()
  }).optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  isAvailable: z.boolean().default(true),
  isSpecial: z.boolean().default(false),
  tags: z.array(z.string()).default([])
});

export const CreateDishSchema = DishSchema;
export const UpdateDishSchema = DishSchema.partial();

export type DishInput = z.infer<typeof DishSchema>;
export type CreateDishInput = z.infer<typeof CreateDishSchema>;
export type UpdateDishInput = z.infer<typeof UpdateDishSchema>;
