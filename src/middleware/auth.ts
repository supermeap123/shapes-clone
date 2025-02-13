import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, JwtPayload as BaseJwtPayload, Algorithm, Secret, VerifyOptions } from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { UnauthorizedError, ForbiddenError } from './errorHandler';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface User {
      id: string;
      role?: string;
    }
  }
}

interface CustomJwtPayload extends BaseJwtPayload {
  id: string;
  role?: string;
}

type SameSiteOption = boolean | 'none' | 'strict' | 'lax';

const JWT_ALGORITHM: Algorithm = 'HS256';
const DEFAULT_EXPIRE = '24h';

/**
 * Get JWT secret and ensure it exists
 */
const getJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret as Secret;
};

/**
 * Type guard for JWT payload
 */
const isCustomJwtPayload = (payload: any): payload is CustomJwtPayload => {
  return typeof payload === 'object' && payload !== null && typeof payload.id === 'string';
};

/**
 * Type guard for non-empty string
 */
const isNonEmptyString = (value: any): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Type guard for authorization header
 */
const isValidAuthHeader = (value: string | string[] | undefined): value is string => {
  return typeof value === 'string' && value.startsWith('Bearer ');
};

/**
 * Type guard for bearer token
 */
const isBearerToken = (value: unknown): value is string => {
  return typeof value === 'string' && value.startsWith('Bearer ') && value.length > 7;
};

/**
 * Get Bearer token from Authorization header
 */
const getBearerToken = (req: Request): string | null => {
  const authHeader = req.headers['authorization'];
  if (Array.isArray(authHeader)) return null;
  
  const header = authHeader || (req.get('Authorization') as string | undefined) || '';
  if (!header.startsWith('Bearer ')) return null;
  
  const token = header.slice(7).trim();
  return isNonEmptyString(token) ? token : null;
};

/**
 * Get token from cookie
 */
const getCookieToken = (cookies: { [key: string]: any } | undefined): string | null => {
  const token = cookies?.token;
  return isNonEmptyString(token) ? token : null;
};

/**
 * Verify JWT token
 */
const verifyToken = (token: string): CustomJwtPayload => {
  try {
    const secret = getJwtSecret();
    const verifyOptions = {
      algorithms: [JWT_ALGORITHM] as const,
      complete: false,
    } satisfies VerifyOptions;

    const result = jwt.verify(token, secret, verifyOptions);

    if (typeof result === 'string' || !isCustomJwtPayload(result)) {
      throw new UnauthorizedError('Invalid token payload');
    }

    return result;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    }
    throw error;
  }
};

/**
 * Extract token from request
 */
const extractToken = (req: Request): string => {
  const bearerToken = getBearerToken(req);
  if (bearerToken) {
    return bearerToken;
  }

  const cookieToken = getCookieToken(req.cookies);
  if (cookieToken) {
    return cookieToken;
  }

  throw new UnauthorizedError('Not authorized to access this route');
};

/**
 * Protect routes - Verify JWT token
 */
export const protect = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = extractToken(req);
    const decoded = verifyToken(token);

    // Add user to request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Grant access to specific roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Not authorized to access this route');
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `User role ${req.user.role} is not authorized to access this route`
      );
    }

    next();
  };
};

/**
 * Check if user owns the resource or is admin
 */
export const checkOwnership = (userId: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Not authorized to access this route');
    }

    if (req.user.role !== 'admin' && req.user.id !== userId) {
      throw new ForbiddenError('Not authorized to access this resource');
    }

    next();
  };
};

/**
 * Generate JWT Token
 */
export const generateToken = (payload: Omit<CustomJwtPayload, 'iat' | 'exp'>): string => {
  const secret = getJwtSecret();
  const expireTime = process.env.JWT_EXPIRE || DEFAULT_EXPIRE;
  const options: SignOptions = {
    algorithm: JWT_ALGORITHM,
    expiresIn: expireTime as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Set token cookie
 */
export const sendTokenCookie = (res: Response, token: string): void => {
  const cookieExpireHours = Number(process.env.JWT_COOKIE_EXPIRE || '24');
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + cookieExpireHours * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  };

  res.cookie('token', token, cookieOptions);
};

/**
 * Clear token cookie
 */
export const clearTokenCookie = (res: Response): void => {
  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };

  res.cookie('token', 'none', cookieOptions);
};
