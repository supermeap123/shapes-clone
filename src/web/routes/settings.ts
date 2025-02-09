import { Router, Request, Response } from 'express';
import { SettingsService } from '../../services/settings';
import { validateToken } from '../middleware/auth';
import { logger } from '../../utils/logger';

const router = Router();

/**
 * Get settings for a guild
 * @route GET /api/settings/:guildId
 */
router.get('/:guildId', validateToken, async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const settings = await SettingsService.getGuildSettings(guildId);
    res.json(settings);
  } catch (error) {
    logger.error('Error getting settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update settings for a guild
 * @route POST /api/settings/:guildId
 */
router.post('/:guildId', validateToken, async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const updateData = req.body;

    // Validate request body
    if (!updateData || typeof updateData !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Update settings
    const updatedSettings = await SettingsService.updateGuildSettings(
      guildId,
      updateData
    );

    res.json({
      success: true,
      data: updatedSettings
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid settings') {
      return res.status(400).json({ error: error.message });
    }
    logger.error('Error updating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete settings for a guild
 * @route DELETE /api/settings/:guildId
 */
router.delete('/:guildId', validateToken, async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    await SettingsService.deleteGuildSettings(guildId);
    res.json({
      success: true,
      message: 'Settings deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Validate settings for a guild
 * @route POST /api/settings/:guildId/validate
 */
router.post('/:guildId/validate', validateToken, async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const settingsData = req.body;

    // Get current settings
    const currentSettings = await SettingsService.getGuildSettings(guildId);

    // Merge with new settings
    const mergedSettings = {
      ...currentSettings,
      ...settingsData,
      // Deep merge for nested objects
      personality: {
        ...currentSettings.personality,
        ...settingsData.personality
      },
      memory: {
        ...currentSettings.memory,
        ...settingsData.memory
      },
      errorMessages: {
        ...currentSettings.errorMessages,
        ...settingsData.errorMessages
      }
    };

    // Validate merged settings
    try {
      await SettingsService.updateGuildSettings(guildId, mergedSettings);
      res.json({
        success: true,
        message: 'Settings are valid'
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid settings') {
        return res.status(400).json({
          success: false,
          error: error.message,
          details: 'Settings validation failed'
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error('Error validating settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Reset settings to defaults for a guild
 * @route POST /api/settings/:guildId/reset
 */
router.post('/:guildId/reset', validateToken, async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;

    // Delete current settings
    await SettingsService.deleteGuildSettings(guildId);

    // Get new default settings
    const defaultSettings = await SettingsService.getGuildSettings(guildId);

    res.json({
      success: true,
      message: 'Settings reset to defaults',
      data: defaultSettings
    });
  } catch (error) {
    logger.error('Error resetting settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
