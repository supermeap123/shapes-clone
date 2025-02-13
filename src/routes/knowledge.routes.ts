import { Router } from 'express';
import { Shape } from '../models/Shape';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Protect all routes
router.use(protect);

// Get knowledge settings
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
      data: shape.knowledge
    });
  } catch (error) {
    next(error);
  }
});

// Update knowledge settings
router.put('/:shapeId', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { knowledge: req.body },
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
      data: shape.knowledge
    });
  } catch (error) {
    next(error);
  }
});

// Update general knowledge
router.put('/:shapeId/general', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { 'knowledge.generalKnowledge': req.body },
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
      data: shape.knowledge?.generalKnowledge
    });
  } catch (error) {
    next(error);
  }
});

// Update commands
router.put('/:shapeId/commands', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { 'knowledge.commands': req.body },
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
      data: shape.knowledge?.commands
    });
  } catch (error) {
    next(error);
  }
});

// Update relationships
router.put('/:shapeId/relationships', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { 'knowledge.relationships': req.body },
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
      data: shape.knowledge?.relationships
    });
  } catch (error) {
    next(error);
  }
});

export default router;
