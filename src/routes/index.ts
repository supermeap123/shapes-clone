import { Router } from 'express';
import { profileRoutes } from './profile.routes';
import { personalityRoutes } from './personality.routes';
import { freeWillRoutes } from './freewill.routes';
import { knowledgeRoutes } from './knowledge.routes';
import { trainingRoutes } from './training.routes';
import { aiEngineRoutes } from './aiengine.routes';
import { imageEngineRoutes } from './imageengine.routes';
import { voiceEngineRoutes } from './voiceengine.routes';
import { settingsRoutes } from './settings.routes';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected routes
router.use('/profile', authMiddleware, profileRoutes);
router.use('/personality', authMiddleware, personalityRoutes);
router.use('/freewill', authMiddleware, freeWillRoutes);
router.use('/knowledge', authMiddleware, knowledgeRoutes);
router.use('/training', authMiddleware, trainingRoutes);
router.use('/aiengine', authMiddleware, aiEngineRoutes);
router.use('/imageengine', authMiddleware, imageEngineRoutes);
router.use('/voiceengine', authMiddleware, voiceEngineRoutes);
router.use('/settings', authMiddleware, settingsRoutes);

export default router;
