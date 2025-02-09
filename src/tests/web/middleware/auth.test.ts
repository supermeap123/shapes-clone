import { Request, Response, NextFunction } from 'express';
import { 
  validateToken, 
  requirePermissions, 
  requireGuildAccess, 
  rateLimit 
} from '../../../web/middleware/auth';
import { 
  createMockRequest, 
  createMockResponse, 
  createMockNext 
} from '../../../tests/helpers/mockExpress';
import { logger } from '../../../utils/logger';

// Mock logger
jest.mock('../../../utils/logger');

describe('Auth Middleware', () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
    nextFunction = createMockNext();
  });

  describe('validateToken', () => {
    it('should add token payload to request for valid token', () => {
      mockRequest.query.token = 'valid-token';

      validateToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.token).toBeDefined();
      expect(mockRequest.token).toEqual(
        expect.objectContaining({
          userId: expect.any(String),
          guildId: expect.any(String),
          permissions: expect.any(Array),
          exp: expect.any(Number)
        })
      );
    });

    it('should return 401 when no token provided', () => {
      validateToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'No token provided'
      });
    });

    it('should handle validation errors', () => {
      mockRequest.query.token = 'invalid-token';
      // Mock token validation to throw error
      jest.spyOn(global, 'Date').mockImplementationOnce(() => {
        throw new Error('Token validation error');
      });

      validateToken(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid token'
      });
      expect(logger.error).toHaveBeenCalledWith(
        'Token validation error:',
        expect.any(Error)
      );
    });
  });

  describe('requirePermissions', () => {
    beforeEach(() => {
      mockRequest.token = {
        userId: 'user-123',
        guildId: 'guild-123',
        permissions: ['read', 'write'],
        exp: Date.now() + 3600000
      };
    });

    it('should allow access with required permissions', () => {
      const middleware = requirePermissions(['read']);

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should deny access without required permissions', () => {
      const middleware = requirePermissions(['admin']);

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions'
      });
    });

    it('should require token', () => {
      mockRequest.token = undefined;
      const middleware = requirePermissions(['read']);

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'No token provided'
      });
    });
  });

  describe('requireGuildAccess', () => {
    beforeEach(() => {
      mockRequest.token = {
        userId: 'user-123',
        guildId: 'guild-123',
        permissions: ['read'],
        exp: Date.now() + 3600000
      };
      mockRequest.params.guildId = 'guild-123';
    });

    it('should allow access to matching guild', () => {
      requireGuildAccess(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should allow admin access to any guild', () => {
      mockRequest.token!.permissions = ['admin'];
      mockRequest.params.guildId = 'other-guild';

      requireGuildAccess(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should deny access to non-matching guild', () => {
      mockRequest.params.guildId = 'other-guild';

      requireGuildAccess(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'No access to this guild'
      });
    });

    it('should require guild ID', () => {
      mockRequest.params = { guildId: null as unknown as string };

      requireGuildAccess(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Guild ID is required'
      });
    });
  });

  describe('rateLimit', () => {
    beforeEach(() => {
      mockRequest.token = {
        userId: 'user-123',
        guildId: 'guild-123',
        permissions: ['read'],
        exp: Date.now() + 3600000
      };
    });

    it('should allow requests within limit', () => {
      const middleware = rateLimit(5, 1000); // 5 requests per second

      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        middleware(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }

      expect(nextFunction).toHaveBeenCalledTimes(3);
    });

    it('should block requests over limit', () => {
      const middleware = rateLimit(2, 1000); // 2 requests per second

      // Make 3 requests
      for (let i = 0; i < 3; i++) {
        middleware(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }

      expect(nextFunction).toHaveBeenCalledTimes(2);
      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Too many requests',
          retryAfter: expect.any(Number)
        })
      );
    });

    it('should require token', () => {
      mockRequest.token = undefined;
      const middleware = rateLimit(5, 1000);

      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'No token provided'
      });
    });

    it('should reset counter after window', async () => {
      const middleware = rateLimit(2, 100); // 2 requests per 100ms

      // Make 2 requests
      for (let i = 0; i < 2; i++) {
        middleware(
          mockRequest as Request,
          mockResponse as Response,
          nextFunction
        );
      }

      // Wait for window to pass
      await new Promise(resolve => setTimeout(resolve, 150));

      // Make another request
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledTimes(3);
    });
  });
});
