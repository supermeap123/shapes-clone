import { Router } from 'express';
import { Shape } from '../models/Shape';
import { protect, authorize } from '../middleware/auth';
import { ISettings } from '../types/shape';

const router = Router();

// Protect all routes
router.use(protect);

// Get settings
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
      data: shape.settings
    });
  } catch (error) {
    next(error);
  }
});

// Update settings
router.put('/:shapeId', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Initialize settings if it doesn't exist
    if (!shape.settings) {
      const defaultSettings: ISettings = {
        shapeOwners: [],
        slashCommands: [],
        privacySettings: {
          serverListVisibility: true,
          dmResponseSettings: {
            enabled: true,
            allowlist: [],
            blocklist: []
          },
          ignoreList: []
        },
        customMessages: {
          wackMessage: undefined,
          errorMessage: undefined,
          sleepMessage: undefined,
          serverJoinMessage: undefined
        }
      };
      shape.settings = defaultSettings;
    }

    // Update settings
    shape.settings = {
      ...shape.settings,
      ...req.body
    };

    await shape.save();

    res.json({
      success: true,
      data: shape.settings
    });
  } catch (error) {
    next(error);
  }
});

// Update privacy settings
router.put('/:shapeId/privacy', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Initialize settings and privacy settings if they don't exist
    if (!shape.settings) {
      shape.settings = {
        shapeOwners: [],
        slashCommands: [],
        privacySettings: {
          serverListVisibility: true,
          dmResponseSettings: {
            enabled: true,
            allowlist: [],
            blocklist: []
          },
          ignoreList: []
        },
        customMessages: {}
      };
    }

    // Update privacy settings
    shape.settings.privacySettings = {
      ...shape.settings.privacySettings,
      ...req.body
    };

    await shape.save();

    res.json({
      success: true,
      data: shape.settings.privacySettings
    });
  } catch (error) {
    next(error);
  }
});

// Update custom messages
router.put('/:shapeId/messages', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Initialize settings and custom messages if they don't exist
    if (!shape.settings) {
      shape.settings = {
        shapeOwners: [],
        slashCommands: [],
        privacySettings: {
          serverListVisibility: true,
          dmResponseSettings: {
            enabled: true,
            allowlist: [],
            blocklist: []
          },
          ignoreList: []
        },
        customMessages: {}
      };
    }

    // Update custom messages
    shape.settings.customMessages = {
      ...shape.settings.customMessages,
      ...req.body
    };

    await shape.save();

    res.json({
      success: true,
      data: shape.settings.customMessages
    });
  } catch (error) {
    next(error);
  }
});

// Update slash commands
router.put('/:shapeId/commands', async (req, res, next) => {
  try {
    const shape = await Shape.findById(req.params.shapeId);
    if (!shape) {
      return res.status(404).json({
        success: false,
        message: 'Shape not found'
      });
    }

    // Initialize settings if it doesn't exist
    if (!shape.settings) {
      shape.settings = {
        shapeOwners: [],
        slashCommands: [],
        privacySettings: {
          serverListVisibility: true,
          dmResponseSettings: {
            enabled: true,
            allowlist: [],
            blocklist: []
          },
          ignoreList: []
        },
        customMessages: {}
      };
    }

    // Update slash commands
    shape.settings.slashCommands = req.body;
    await shape.save();

    res.json({
      success: true,
      data: shape.settings.slashCommands
    });
  } catch (error) {
    next(error);
  }
});

export default router;
