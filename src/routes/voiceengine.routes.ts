import { Router } from 'express';
import { Shape } from '../models/Shape';
import { protect, authorize } from '../middleware/auth';
import { IVoiceEngine } from '../types/shape';

const router = Router();

// Protect all routes
router.use(protect);

// Get voice engine settings
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
      data: shape.voiceEngine
    });
  } catch (error) {
    next(error);
  }
});

// Update voice engine settings
router.put('/:shapeId', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Initialize voiceEngine if it doesn't exist
    if (!shape.voiceEngine) {
      const defaultVoiceEngine: IVoiceEngine = {
        voiceResponses: false
      };
      shape.voiceEngine = defaultVoiceEngine;
    }

    // Update voice engine settings
    shape.voiceEngine = {
      ...shape.voiceEngine,
      ...req.body
    };

    await shape.save();

    res.json({
      success: true,
      data: shape.voiceEngine
    });
  } catch (error) {
    next(error);
  }
});

// Toggle voice responses
router.put('/:shapeId/toggle', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Initialize voiceEngine if it doesn't exist
    if (!shape.voiceEngine) {
      shape.voiceEngine = {
        voiceResponses: false
      };
    }

    // Toggle voice responses
    shape.voiceEngine.voiceResponses = !shape.voiceEngine.voiceResponses;
    await shape.save();

    res.json({
      success: true,
      data: {
        voiceResponses: shape.voiceEngine.voiceResponses
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
