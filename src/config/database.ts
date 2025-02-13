import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import { CustomError } from '../middleware/errorHandler';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shapes-admin';

// MongoDB connection options
const mongooseOptions: ConnectOptions = {
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  writeConcern: {
    w: 1, // Wait for the write to be acknowledged by the primary
    j: true // Wait for the write to be committed to the journal
  }
};

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log(`MongoDB connected successfully to ${MONGODB_URI}`);

    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomError(`MongoDB connection error: ${error.message}`, 500);
    }
    throw new CustomError('Unknown MongoDB connection error', 500);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
  // Attempt to reconnect on error
  setTimeout(() => {
    console.log('Attempting to reconnect to MongoDB...');
    connectDB().catch(console.error);
  }, 5000);
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB shutdown:', err);
    process.exit(1);
  }
});

// Handle nodemon restarts
process.once('SIGUSR2', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
  } catch (err) {
    console.error('Error during nodemon restart:', err);
    process.exit(1);
  }
});
