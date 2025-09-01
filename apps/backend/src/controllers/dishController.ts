import { Request, Response } from 'express';
import { Dish } from '../models/Dish';
import { AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

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

export const getAllDishes = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      cuisine,
      isVegetarian,
      isVegan,
      isGlutenFree,
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object
    const filter: any = { isAvailable: true };

    if (category) filter.category = category;
    if (cuisine) filter.cuisine = cuisine;
    if (isVegetarian === 'true') filter.isVegetarian = true;
    if (isVegan === 'true') filter.isVegan = true;
    if (isGlutenFree === 'true') filter.isGlutenFree = true;

    // Text search
    if (search) {
      filter.$text = { $search: search as string };
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sort as string] = order === 'desc' ? -1 : 1;

    const [dishes, total] = await Promise.all([
      Dish.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNumber),
      Dish.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    res.json({
      success: true,
      message: 'Dishes retrieved successfully',
      data: {
        items: dishes,
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1
      },
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dishes',
      error: (error as Error).message,
      statusCode: 500
    });
  }
};

export const getDishById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findById(id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found',
        statusCode: 404
      });
    }

    res.json({
      success: true,
      message: 'Dish retrieved successfully',
      data: dish,
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dish',
      error: (error as Error).message,
      statusCode: 500
    });
  }
};

export const createDish = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const dishData = CreateDishSchema.parse(req.body);

    const dish = await Dish.create(dishData);

    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      data: dish,
      statusCode: 201
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create dish',
      error: (error as Error).message,
      statusCode: 500
    });
  }
};

export const updateDish = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = UpdateDishSchema.parse(req.body);

    const dish = await Dish.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found',
        statusCode: 404
      });
    }

    res.json({
      success: true,
      message: 'Dish updated successfully',
      data: dish,
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update dish',
      error: (error as Error).message,
      statusCode: 500
    });
  }
};

export const deleteDish = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findByIdAndDelete(id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found',
        statusCode: 404
      });
    }

    res.json({
      success: true,
      message: 'Dish deleted successfully',
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete dish',
      error: (error as Error).message,
      statusCode: 500
    });
  }
};

export const getFeaturedDishes = async (req: Request, res: Response) => {
  try {
    const dishes = await Dish.find({
      isAvailable: true,
      isSpecial: true
    })
    .sort({ averageRating: -1 })
    .limit(6);

    res.json({
      success: true,
      message: 'Featured dishes retrieved successfully',
      data: dishes,
      statusCode: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured dishes',
      error: (error as Error).message,
      statusCode: 500
    });
  }
};
