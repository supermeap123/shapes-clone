import { Request, Response, NextFunction } from 'express';
import type { TokenPayload } from '../../web/middleware/auth';

/**
 * Create a mock Express request
 */
export function createMockRequest(overrides: Partial<Request> = {}): Request {
  const req = {
    query: {},
    params: {},
    body: {},
    headers: {},
    cookies: {},
    signedCookies: {},
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    range: jest.fn(),
    param: jest.fn(),
    is: jest.fn(),
    protocol: 'http',
    secure: false,
    ip: '127.0.0.1',
    ips: [],
    subdomains: [],
    path: '/',
    hostname: 'localhost',
    host: 'localhost',
    fresh: false,
    stale: true,
    xhr: false,
    method: 'GET',
    url: '/',
    originalUrl: '/',
    baseUrl: '',
    app: {} as any,
    res: {} as any,
    next: jest.fn(),
    ...overrides
  } as Request;

  // Add token property for our custom Request type
  (req as any).token = undefined;

  return req;
}

/**
 * Create a mock Express response
 */
export function createMockResponse(overrides: Partial<Response> = {}): Response {
  return {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    type: jest.fn().mockReturnThis(),
    format: jest.fn().mockReturnThis(),
    links: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    get: jest.fn(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    location: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    render: jest.fn().mockReturnThis(),
    locals: {},
    charset: '',
    headersSent: false,
    app: {} as any,
    req: {} as any,
    ...overrides
  } as unknown as Response;
}

/**
 * Create a mock token payload
 */
export function createMockTokenPayload(overrides: Partial<TokenPayload> = {}): TokenPayload {
  return {
    userId: 'mock-user-id',
    guildId: 'mock-guild-id',
    permissions: ['read'],
    exp: Date.now() + 3600000,
    ...overrides
  };
}

/**
 * Create a mock next function
 */
export function createMockNext(): NextFunction {
  return jest.fn();
}

/**
 * Create a mock error for testing error handlers
 */
export function createMockError(message = 'Test error', code = 500): Error & { code?: number } {
  const error = new Error(message);
  (error as any).code = code;
  return error;
}

/**
 * Helper to verify response was JSON with given status
 */
export function expectJsonResponse(
  res: Partial<Response>,
  status: number,
  body: Record<string, any>
): void {
  expect(res.status).toHaveBeenCalledWith(status);
  expect(res.json).toHaveBeenCalledWith(body);
}

/**
 * Helper to verify error response
 */
export function expectErrorResponse(
  res: Partial<Response>,
  status: number,
  message: string
): void {
  expectJsonResponse(res, status, { error: message });
}
