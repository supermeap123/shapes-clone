import 'dotenv/config';
import { bot } from './Bot';
import mongoose from 'mongoose';
import config from './config/config';

/**
 * Initialize MongoDB connection
 */
async function initializeDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.database.uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Set up global error handlers
 */
function setupErrorHandlers(): void {
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Attempt graceful shutdown
    shutdown(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Attempt graceful shutdown
    shutdown(1);
  });
}

/**
 * Graceful shutdown function
 */
async function shutdown(code: number = 0): Promise<void> {
  console.log('Shutting down...');
  try {
    // Stop the bot
    await bot.stop();

    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');

    // Exit process
    process.exit(code);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

/**
 * Main function to start the application
 */
async function main(): Promise<void> {
  try {
    // Set up error handlers
    setupErrorHandlers();

    // Initialize database
    await initializeDatabase();

    // Start the bot
    await bot.start();

    console.log('Discord bot is running');
  } catch (error) {
    console.error('Failed to start application:', error);
    await shutdown(1);
  }
}

// Start the application
main().catch(console.error);
