import { Router } from 'express';
import { Shape } from '../models/Shape';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Protect all routes
router.use(protect);

// Get personality settings
router.get('/:shapeId', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    res.json({
      success: true,
      data: shape.personality
    });
  } catch (error) {
    next(error);
  }
});

// Update personality settings
router.put('/:shapeId', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { personality: req.body },
      { new: true, runValidators: true }
    );

    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    res.json({
      success: true,
      data: shape.personality
    });
  } catch (error) {
    next(error);
  }
});

export default router;
