import { Router } from 'express';
import { Shape } from '../models/Shape';
import { protect, authorize } from '../middleware/auth';
import { IImageEngine } from '../types/shape';

const router = Router();

// Protect all routes
router.use(protect);

// Get image engine settings
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
      data: shape.imageEngine
    });
  } catch (error) {
    next(error);
  }
});

// Update image engine settings
router.put('/:shapeId', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { imageEngine: req.body },
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
      data: shape.imageEngine
    });
  } catch (error) {
    next(error);
  }
});

// Update image size options
router.put('/:shapeId/size-options', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Initialize imageEngine if it doesn't exist
    if (!shape.imageEngine) {
      const defaultImageEngine: IImageEngine = {
        textCommandPrefix: '!imagine',
        imageEngine: undefined,
        imagePreset: undefined,
        imageSizeOptions: []
      };
      shape.imageEngine = defaultImageEngine;
    }

    // Update image size options
    shape.imageEngine.imageSizeOptions = req.body;
    await shape.save();

    res.json({
      success: true,
      data: shape.imageEngine.imageSizeOptions
    });
  } catch (error) {
    next(error);
  }
});

// Update command prefix
router.put('/:shapeId/command-prefix', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { 'imageEngine.textCommandPrefix': req.body.prefix },
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
      data: shape.imageEngine?.textCommandPrefix
    });
  } catch (error) {
    next(error);
  }
});

// Update image preset
router.put('/:shapeId/preset', async (req, res, next) => {
  try {
    const shape = await Shape.findByIdAndUpdate(
      req.params.shapeId,
      { 'imageEngine.imagePreset': req.body.preset },
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
      data: shape.imageEngine?.imagePreset
    });
  } catch (error) {
    next(error);
  }
});

export default router;
