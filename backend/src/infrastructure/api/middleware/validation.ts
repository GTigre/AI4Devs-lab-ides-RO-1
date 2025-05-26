import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../../../domain/errors/ApplicationError';

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        next(new ValidationError(JSON.stringify(errors)));
      } else {
        next(error);
      }
    }
  };
};

export const candidateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  education: z.string().min(2, 'Education must be at least 2 characters'),
  experience: z.string().min(2, 'Experience must be at least 2 characters'),
  processStatus: z.enum(['NEW', 'IN_REVIEW', 'DISCARDED', 'FINALIST', 'HIRED']).optional(),
  consentAccepted: z.boolean(),
}); 