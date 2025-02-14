import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import profileRoutes from './profile.routes';
import personalityRoutes from './personality.routes';
import freewillRoutes from './freewill.routes';
import knowledgeRoutes from './knowledge.routes';
import trainingRoutes from './training.routes';
import aiengineRoutes from './aiengine.routes';
import imageengineRoutes from './imageengine.routes';
import voiceengineRoutes from './voiceengine.routes';
import settingsRoutes from './settings.routes';
import shapeRoutes from './shape.routes';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/shapes', authenticateJWT, shapeRoutes);
router.use('/admin', authenticateJWT, adminRoutes);
router.use('/profile', authenticateJWT, profileRoutes);
router.use('/personality', authenticateJWT, personalityRoutes);
router.use('/freewill', authenticateJWT, freewillRoutes);
router.use('/knowledge', authenticateJWT, knowledgeRoutes);
router.use('/training', authenticateJWT, trainingRoutes);
router.use('/ai-engine', authenticateJWT, aiengineRoutes);
router.use('/image-engine', authenticateJWT, imageengineRoutes);
router.use('/voice-engine', authenticateJWT, voiceengineRoutes);
router.use('/settings', authenticateJWT, settingsRoutes);

export default router;
