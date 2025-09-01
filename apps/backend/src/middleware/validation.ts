import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, z, ZodIssue } from 'zod';

export const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.issues.forEach((err: ZodIssue) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors,
          statusCode: 400
        });
      }
      
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.issues.forEach((err: ZodIssue) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });

        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          errors,
          statusCode: 400
        });
      }
      
      next(error);
    }
  };
};
