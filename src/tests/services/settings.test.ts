import { SettingsService, GuildSettings } from '../../services/settings';
import { logger } from '../../utils/logger';
import {
  createMockSettings,
  createMockSettingsUpdate,
  createInvalidSettings
} from '../helpers/mockSettings';

// Mock logger
jest.mock('../../utils/logger');

describe('Settings Service', () => {
  const mockGuildId = '123456789';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGuildSettings', () => {
    it('should return default settings for new guild', async () => {
      const settings = await SettingsService.getGuildSettings(mockGuildId);

      expect(settings).toBeDefined();
      expect(settings.guildId).toBe(mockGuildId);
      expect(settings.personality).toBeDefined();
      expect(settings.memory).toBeDefined();
      expect(Array.isArray(settings.commands)).toBe(true);
    });

    it('should return existing settings for guild', async () => {
      // First call to create settings
      await SettingsService.getGuildSettings(mockGuildId);

      // Update settings
      const updatedSettings = createMockSettingsUpdate({
        personality: {
          backstory: 'Custom backstory',
          traits: ['custom', 'traits'],
          tone: 'professional',
          likes: ['custom likes'],
          dislikes: ['custom dislikes'],
          conversationStyle: 'formal'
        }
      });

      await SettingsService.updateGuildSettings(mockGuildId, updatedSettings);

      // Get settings again
      const settings = await SettingsService.getGuildSettings(mockGuildId);

      expect(settings.personality.backstory).toBe('Custom backstory');
      expect(settings.personality.traits).toEqual(['custom', 'traits']);
      expect(settings.personality.tone).toBe('professional');
    });

    it('should handle errors gracefully', async () => {
      // Mock Map.get to throw error
      const originalGet = Map.prototype.get;
      Map.prototype.get = jest.fn().mockImplementation(() => {
        throw new Error('Mock error');
      });

      await expect(SettingsService.getGuildSettings(mockGuildId))
        .rejects
        .toThrow('Failed to get guild settings');

      expect(logger.error).toHaveBeenCalledWith(
        'Error getting guild settings:',
        expect.any(Error)
      );

      // Restore original Map.get
      Map.prototype.get = originalGet;
    });
  });

  describe('updateGuildSettings', () => {
    it('should update existing settings', async () => {
      // Create initial settings
      await SettingsService.getGuildSettings(mockGuildId);

      const updateData = createMockSettingsUpdate({
        enableDMs: true,
        personality: {
          backstory: 'Updated backstory',
          traits: ['updated', 'traits'],
          tone: 'casual',
          likes: ['updated likes'],
          dislikes: ['updated dislikes'],
          conversationStyle: 'adaptive'
        },
        memory: {
          retention: 200,
          revivalThreshold: 45,
          timeAware: false
        }
      });

      const updatedSettings = await SettingsService.updateGuildSettings(
        mockGuildId,
        updateData
      );

      expect(updatedSettings.enableDMs).toBe(true);
      expect(updatedSettings.personality.backstory).toBe('Updated backstory');
      expect(updatedSettings.memory.retention).toBe(200);
    });

    it('should validate settings before update', async () => {
      const invalidSettings = {
        personality: {
          // Missing required fields
          backstory: 123, // Invalid type
          traits: 'not an array' // Invalid type
        }
      };

      await expect(
        SettingsService.updateGuildSettings(mockGuildId, invalidSettings as any)
      ).rejects.toThrow('Invalid settings');
    });

    it('should merge nested objects correctly', async () => {
      // Create initial settings
      const initialSettings = await SettingsService.getGuildSettings(mockGuildId);

      // Update only some fields
      const updateData = createMockSettingsUpdate({
        personality: {
          backstory: 'New backstory'
        },
        memory: {
          retention: 150
        }
      });

      const updatedSettings = await SettingsService.updateGuildSettings(
        mockGuildId,
        updateData
      );

      // Check updated fields
      expect(updatedSettings.personality.backstory).toBe('New backstory');
      expect(updatedSettings.memory.retention).toBe(150);

      // Check preserved fields
      expect(updatedSettings.personality.traits).toEqual(initialSettings.personality.traits);
      expect(updatedSettings.memory.timeAware).toBe(initialSettings.memory.timeAware);
    });
  });

  describe('deleteGuildSettings', () => {
    it('should delete settings for guild', async () => {
      // Create settings
      await SettingsService.getGuildSettings(mockGuildId);

      // Delete settings
      await SettingsService.deleteGuildSettings(mockGuildId);

      // Getting settings again should return default settings
      const newSettings = await SettingsService.getGuildSettings(mockGuildId);
      expect(newSettings.personality.backstory).toBe('A friendly AI assistant eager to help.');
    });

    it('should handle errors gracefully', async () => {
      // Mock Map.delete to throw error
      const originalDelete = Map.prototype.delete;
      Map.prototype.delete = jest.fn().mockImplementation(() => {
        throw new Error('Mock error');
      });

      await expect(SettingsService.deleteGuildSettings(mockGuildId))
        .rejects
        .toThrow('Failed to delete guild settings');

      expect(logger.error).toHaveBeenCalledWith(
        'Error deleting guild settings:',
        expect.any(Error)
      );

      // Restore original Map.delete
      Map.prototype.delete = originalDelete;
    });
  });

  describe('Settings Validation', () => {
    it('should validate all required fields', async () => {
      const invalidSettings = createInvalidSettings();

      for (const settings of invalidSettings) {
        await expect(
          SettingsService.updateGuildSettings(mockGuildId, settings)
        ).rejects.toThrow('Invalid settings');
      }
    });
  });
});
