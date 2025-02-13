import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import profileRoutes from './routes/profile.routes';
import personalityRoutes from './routes/personality.routes';
import freeWillRoutes from './routes/freewill.routes';
import knowledgeRoutes from './routes/knowledge.routes';
import trainingRoutes from './routes/training.routes';
import aiEngineRoutes from './routes/aiengine.routes';
import imageEngineRoutes from './routes/imageengine.routes';
import voiceEngineRoutes from './routes/voiceengine.routes';
import settingsRoutes from './routes/settings.routes';
import adminRoutes from './routes/admin.routes';

// Load environment variables
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API routes
const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

apiRouter.use('/profile', profileRoutes);
apiRouter.use('/personality', personalityRoutes);
apiRouter.use('/freewill', freeWillRoutes);
apiRouter.use('/knowledge', knowledgeRoutes);
apiRouter.use('/training', trainingRoutes);
apiRouter.use('/ai-engine', aiEngineRoutes);
apiRouter.use('/image-engine', imageEngineRoutes);
apiRouter.use('/voice-engine', voiceEngineRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/admin', adminRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;
