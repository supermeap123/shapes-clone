import { Router } from 'express';
import { Shape } from '../models/Shape';
import { protect, authorize } from '../middleware/auth';
import { ITraining } from '../types/shape';

const router = Router();

// Protect all routes
router.use(protect);

// Get training settings
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
      data: shape.training
    });
  } catch (error) {
    next(error);
  }
});

// Update training settings
router.put('/:shapeId', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { training: req.body },
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
      data: shape.training
    });
  } catch (error) {
    next(error);
  }
});

// Add conversation snippet
router.post('/:shapeId/snippets', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Initialize training if it doesn't exist
    if (!shape.training) {
      const defaultTraining: ITraining = {
        conversationSnippets: []
      };
      shape.training = defaultTraining;
    }

    // Initialize conversationSnippets if it doesn't exist
    if (!shape.training.conversationSnippets) {
      shape.training.conversationSnippets = [];
    }

    // Add the new snippet
    shape.training.conversationSnippets.push(req.body.snippet);
    await shape.save();

    res.json({
      success: true,
      data: shape.training.conversationSnippets
    });
  } catch (error) {
    next(error);
  }
});

// Remove conversation snippet
router.delete('/:shapeId/snippets/:index', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Check if training and conversationSnippets exist
    if (!shape.training?.conversationSnippets) {
      return res.status(404).json({
        success: false,
        message: 'No conversation snippets found'
      });
    }

    const index = parseInt(req.params.index);
    if (index < 0 || index >= shape.training.conversationSnippets.length) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    // Remove the snippet
    shape.training.conversationSnippets.splice(index, 1);
    await shape.save();

    res.json({
      success: true,
      data: shape.training.conversationSnippets
    });
  } catch (error) {
    next(error);
  }
});

export default router;
