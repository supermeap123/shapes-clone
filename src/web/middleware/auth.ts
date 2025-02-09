import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

/**
 * Interface for decoded JWT token payload
 */
export interface TokenPayload {
  userId: string;
  guildId: string;
  permissions: string[];
  exp: number;
}

/**
 * Extend Express Request type to include token payload
 */
declare global {
  namespace Express {
    interface Request {
      token?: TokenPayload;
    }
  }
}

/**
 * Middleware to validate authentication token
 */
export function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.query.token as string;

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // TODO: Implement JWT verification
    // This would typically:
    // 1. Verify token signature
    // 2. Check expiration
    // 3. Validate permissions
    // For now, we'll just check if token exists

    // Add token payload to request for use in route handlers
    req.token = {
      userId: 'mock-user-id',
      guildId: req.params.guildId || 'mock-guild-id',
      permissions: ['admin'],
      exp: Date.now() + 3600000 // 1 hour from now
    };

    next();
  } catch (error) {
    logger.error('Token validation error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

/**
 * Middleware to check if user has required permissions
 */
export function requirePermissions(permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.token) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const hasPermission = permissions.every(permission =>
        req.token!.permissions.includes(permission)
      );

      if (!hasPermission) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    } catch (error) {
      logger.error('Permission check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check if user has access to guild
 */
export function requireGuildAccess(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    if (!req.token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const { guildId } = req.params;
    if (!guildId) {
      res.status(400).json({ error: 'Guild ID is required' });
      return;
    }

    // TODO: Implement guild access verification
    // This would typically:
    // 1. Check if user is member of guild
    // 2. Verify user has required role/permissions in guild
    // For now, we'll just check if guildId matches token

    if (req.token.guildId !== guildId && !req.token.permissions.includes('admin')) {
      res.status(403).json({ error: 'No access to this guild' });
      return;
    }

    next();
  } catch (error) {
    logger.error('Guild access check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Middleware to check rate limits
 */
export function rateLimit(
  maxRequests: number,
  windowMs: number
) {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.token) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const now = Date.now();
      const userId = req.token.userId;

      // Get user's request timestamps
      const userRequests = requests.get(userId) || [];

      // Filter out old requests
      const recentRequests = userRequests.filter(
        timestamp => now - timestamp < windowMs
      );

      if (recentRequests.length >= maxRequests) {
        res.status(429).json({
          error: 'Too many requests',
          retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
        });
        return;
      }

      // Add current request
      recentRequests.push(now);
      requests.set(userId, recentRequests);

      next();
    } catch (error) {
      logger.error('Rate limit check error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
