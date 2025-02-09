import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import settingsRouter from './routes/settings';
import { validateToken } from './middleware/auth';
import type { TokenPayload } from './middleware/auth';

// Create Express server
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Mount settings routes
app.use('/api/settings', settingsRouter);

// Dashboard route
app.get('/dashboard/:guildId', validateToken, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
export async function startWebServer(): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      const server = app.listen(env.PORT, () => {
        logger.info(`Web server running on port ${env.PORT}`);
        resolve();
      });

      server.on('error', (error) => {
        logger.error('Failed to start web server:', error);
        reject(error);
      });
    });
  } catch (error) {
    logger.error('Error in startWebServer:', error);
    throw error;
  }
}

// Export for testing
export { app };

// Types
export interface DashboardRequest extends Request {
  guildId?: string;
  token?: TokenPayload;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}
