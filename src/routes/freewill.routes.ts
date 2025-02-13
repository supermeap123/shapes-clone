import { Router } from 'express';
import { Shape } from '../models/Shape';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Protect all routes
router.use(protect);

// Get freewill settings
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
      data: shape.freeWill
    });
  } catch (error) {
    next(error);
  }
});

// Update freewill settings
router.put('/:shapeId', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { freeWill: req.body },
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
      data: shape.freeWill
    });
  } catch (error) {
    next(error);
  }
});

// Update reactions
router.put('/:shapeId/reactions', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { 'freeWill.reactions': req.body },
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
      data: shape.freeWill?.reactions
    });
  } catch (error) {
    next(error);
  }
});

// Update keywords of interest
router.put('/:shapeId/keywords', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { 'freeWill.keywordsOfInterest': req.body },
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
      data: shape.freeWill?.keywordsOfInterest
    });
  } catch (error) {
    next(error);
  }
});

export default router;
