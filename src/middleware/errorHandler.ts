import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { MulterError } from 'multer';

// Base custom error class
export class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors: any[] = []
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends CustomError {
  constructor(message: string = 'Validation Error', errors: string[] = []) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  stack?: string;
}

export const errorHandler = (
  err: Error | CustomError | MongooseError | MulterError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error: CustomError;

  // Log error
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new ValidationError('Database Validation Error', messages);
  }
  // Mongoose duplicate key error
  else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    error = new ValidationError(`Duplicate field value: ${field}`);
  }
  // JWT errors
  else if (err instanceof JsonWebTokenError) {
    error = new UnauthorizedError('Invalid token');
  }
  else if (err instanceof TokenExpiredError) {
    error = new UnauthorizedError('Token expired');
  }
  // Multer file size error
  else if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new ValidationError('File size exceeds limit');
    } else {
      error = new ValidationError(`File upload error: ${err.message}`);
    }
  }
  // Custom error
  else if (err instanceof CustomError) {
    error = err;
  }
  // Default error
  else {
    error = new CustomError(
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error',
      500
    );
  }

  // Prepare error response
  const response: ErrorResponse = {
    success: false,
    message: error.message,
  };

  // Add errors array if present
  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Send response
  res.status(error.statusCode).json(response);
};

// Async handler wrapper
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found handler
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  next(new NotFoundError(`Not Found - ${req.originalUrl}`));
};
