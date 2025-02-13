import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

// Request handler types
export type RequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> = (
  req: ExpressRequest<P, ResBody, ReqBody, ReqQuery>,
  res: ExpressResponse<ResBody>,
  next: Express.NextFunction
) => Promise<void> | void;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field?: string;
    message: string;
    value?: any;
  }>;
}

// Common request body types
export interface UpdateProfileBody {
  nickname?: string;
  description?: string;
  appearance?: string;
  initialMessage?: string;
  discordName?: string;
  bio?: string;
}

export interface UpdateVanityUrlBody {
  newVanityUrl: string;
}

// File upload types
export interface FileUploadResult {
  url: string;
  publicId: string;
}

// Shape-related types
export interface ShapeOwner {
  id: string;
  username: string;
  role: string;
}

// Validation types
export interface ValidationError {
  field?: string;
  message: string;
  value?: any;
}
