import winston from 'winston';
import { env } from '../config/env';

export function setupLogger() {
  const logger = winston.createLogger({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'shapes-clone' },
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    ]
  });

  // If we're not in production, log to console as well
  if (env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }

  return logger;
}

// Create a default logger instance
const logger = setupLogger();

// Export both the setup function and default instance
export { logger };

// Type definitions for logging
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogContext {
  [key: string]: any;
}

// Helper functions for structured logging
export const log = {
  error: (message: string, error?: Error, context?: LogContext) => {
    logger.error(message, { error, ...context });
  },
  warn: (message: string, context?: LogContext) => {
    logger.warn(message, context);
  },
  info: (message: string, context?: LogContext) => {
    logger.info(message, context);
  },
  debug: (message: string, context?: LogContext) => {
    logger.debug(message, context);
  }
};
