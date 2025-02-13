import { Router } from 'express';
import { Shape } from '../models/Shape';
import { protect, authorize } from '../middleware/auth';
import { IAIEngine } from '../types/shape';

const router = Router();

// Protect all routes
router.use(protect);

// Get AI engine settings
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
      data: shape.aiEngine
    });
  } catch (error) {
    next(error);
  }
});

// Update AI engine settings
router.put('/:shapeId', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { aiEngine: req.body },
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
      data: shape.aiEngine
    });
  } catch (error) {
    next(error);
  }
});

// Update memory settings
router.put('/:shapeId/memory', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Initialize aiEngine if it doesn't exist
    if (!shape.aiEngine) {
      const defaultAIEngine: IAIEngine = {
        primaryEngine: undefined,
        fallbackEngine: undefined,
        freeWillEngine: undefined,
        languagePresets: [],
        enginePresets: [],
        temperature: 0.7,
        topP: 1,
        maxResponseLength: 2000,
        contextWindow: 4000,
        memorySettings: {
          shortTermEnabled: true,
          longTermEnabled: true,
          memoryGeneration: true,
          memoryRecall: true,
          memorySharing: false
        }
      };
      shape.aiEngine = defaultAIEngine;
    }

    // Update memory settings
    if (!shape.aiEngine.memorySettings) {
      shape.aiEngine.memorySettings = {
        shortTermEnabled: true,
        longTermEnabled: true,
        memoryGeneration: true,
        memoryRecall: true,
        memorySharing: false
      };
    }

    shape.aiEngine.memorySettings = {
      ...shape.aiEngine.memorySettings,
      ...req.body
    };

    await shape.save();

    res.json({
      success: true,
      data: shape.aiEngine.memorySettings
    });
  } catch (error) {
    next(error);
  }
});

// Update language presets
router.put('/:shapeId/language-presets', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { 'aiEngine.languagePresets': req.body },
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
      data: shape.aiEngine?.languagePresets
    });
  } catch (error) {
    next(error);
  }
});

// Update engine presets
router.put('/:shapeId/engine-presets', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { 'aiEngine.enginePresets': req.body },
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
      data: shape.aiEngine?.enginePresets
    });
  } catch (error) {
    next(error);
  }
});

export default router;
