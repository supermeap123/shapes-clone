import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError as ExpressValidationError } from 'express-validator';
import { ValidationError } from './errorHandler';

type ValidationErrorType = ExpressValidationError & {
  type?: string;
  path?: string;
  location?: string;
  param?: string;
  value?: any;
  msg: string;
};

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => {
      const error = err as ValidationErrorType;
      if (error.path) {
        return `${error.path}: ${error.msg}`;
      }
      if (error.param) {
        return `${error.param}: ${error.msg}`;
      }
      return error.msg;
    });
    throw new ValidationError('Validation failed', errorMessages);
  }
  next();
};
