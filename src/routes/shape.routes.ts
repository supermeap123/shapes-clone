import express from 'express';
import { createShape, getShapes, getShapeById, updateShape, deleteShape } from '../controllers/shape.controller';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateJWT);

// Shape routes
router.post('/', createShape);
router.get('/', getShapes);
router.get('/:id', getShapeById);
router.patch('/:id', updateShape);
router.delete('/:id', deleteShape);

export default router;
