import { BotConfig, PersonalityConfig } from '../discord/types';
import { logger } from '../utils/logger';

// In-memory storage (replace with database in production)
const guildSettings = new Map<string, GuildSettings>();

export interface GuildSettings {
  guildId: string;
  botToken?: string;
  openrouterKey?: string;
  enableDMs: boolean;
  showServerList: boolean;
  personality: PersonalityConfig;
  memory: {
    retention: number;
    revivalThreshold: number;
    timeAware: boolean;
  };
  commands: CommandSettings[];
  errorMessages: {
    default: string;
    permissionDenied: string;
    cooldown: string;
  };
  welcomeMessage: string;
  memoryUpdateMessage: string;
  serverJoinMessage: string;
}

export interface CommandSettings {
  name: string;
  enabled: boolean;
  cooldown?: number;
  permissions?: string[];
}

export class SettingsService {
  /**
   * Get settings for a specific guild
   * @param guildId The Discord guild ID
   * @returns Guild settings or default settings if none exist
   */
  static async getGuildSettings(guildId: string): Promise<GuildSettings> {
    try {
      // Try to get existing settings
      const settings = guildSettings.get(guildId);
      if (settings) return settings;

      // Create default settings
      const defaultSettings = this.createDefaultSettings(guildId);
      guildSettings.set(guildId, defaultSettings);
      
      return defaultSettings;
    } catch (error) {
      logger.error('Error getting guild settings:', error);
      throw new Error('Failed to get guild settings');
    }
  }

  /**
   * Update settings for a specific guild
   * @param guildId The Discord guild ID
   * @param settings New settings to apply
   * @returns Updated settings
   */
  static async updateGuildSettings(
    guildId: string,
    settings: Partial<GuildSettings>
  ): Promise<GuildSettings> {
    try {
      const currentSettings = await this.getGuildSettings(guildId);
      
      // Merge new settings with current settings
      const updatedSettings = {
        ...currentSettings,
        ...settings,
        // Deep merge for nested objects
        personality: {
          ...currentSettings.personality,
          ...settings.personality
        },
        memory: {
          ...currentSettings.memory,
          ...settings.memory
        },
        errorMessages: {
          ...currentSettings.errorMessages,
          ...settings.errorMessages
        }
      };

      // Validate settings
      if (!this.validateSettings(updatedSettings)) {
        throw new Error('Invalid settings');
      }

      // Save updated settings
      guildSettings.set(guildId, updatedSettings);
      
      return updatedSettings;
    } catch (error) {
      logger.error('Error updating guild settings:', error);
      throw new Error('Failed to update guild settings');
    }
  }

  /**
   * Delete settings for a specific guild
   * @param guildId The Discord guild ID
   */
  static async deleteGuildSettings(guildId: string): Promise<void> {
    try {
      guildSettings.delete(guildId);
    } catch (error) {
      logger.error('Error deleting guild settings:', error);
      throw new Error('Failed to delete guild settings');
    }
  }

  /**
   * Create default settings for a new guild
   * @param guildId The Discord guild ID
   * @returns Default guild settings
   */
  private static createDefaultSettings(guildId: string): GuildSettings {
    return {
      guildId,
      enableDMs: false,
      showServerList: false,
      personality: {
        backstory: 'A friendly AI assistant eager to help.',
        traits: ['helpful', 'friendly', 'knowledgeable'],
        tone: 'casual',
        likes: ['helping users', 'learning new things'],
        dislikes: ['rudeness', 'spam'],
        conversationStyle: 'adaptive'
      },
      memory: {
        retention: 100,
        revivalThreshold: 30,
        timeAware: true
      },
      commands: [
        { name: 'help', enabled: true },
        { name: 'ping', enabled: true },
        { name: 'invite', enabled: true },
        { name: 'debug', enabled: true },
        { name: 'activate', enabled: true },
        { name: 'deactivate', enabled: true },
        { name: 'dashboard', enabled: true },
        { name: 'shape', enabled: true },
        { name: 'resetmemory', enabled: true },
        { name: 'search', enabled: true },
        { name: 'sleep', enabled: true },
        { name: 'clearmemory', enabled: true },
        { name: 'revivechat', enabled: true }
      ],
      errorMessages: {
        default: 'An error occurred. Please try again later.',
        permissionDenied: 'You do not have permission to use this command.',
        cooldown: 'Please wait before using this command again.'
      },
      welcomeMessage: 'Hello! I\'m Shapes, your AI companion.',
      memoryUpdateMessage: 'Processing memory updates...',
      serverJoinMessage: 'Thanks for adding me to your server!'
    };
  }

  /**
   * Validate guild settings
   * @param settings Settings to validate
   * @returns Whether settings are valid
   */
  private static validateSettings(settings: GuildSettings): boolean {
    // Required fields
    if (!settings.guildId) return false;
    if (!settings.personality) return false;
    if (!settings.memory) return false;
    if (!Array.isArray(settings.commands)) return false;

    // Validate personality
    const personality = settings.personality;
    if (!personality.backstory || typeof personality.backstory !== 'string') return false;
    if (!Array.isArray(personality.traits)) return false;
    if (!personality.tone || typeof personality.tone !== 'string') return false;
    if (!Array.isArray(personality.likes)) return false;
    if (!Array.isArray(personality.dislikes)) return false;
    if (!personality.conversationStyle || typeof personality.conversationStyle !== 'string') return false;

    // Validate memory settings
    const memory = settings.memory;
    if (typeof memory.retention !== 'number' || memory.retention < 0) return false;
    if (typeof memory.revivalThreshold !== 'number' || memory.revivalThreshold < 0) return false;
    if (typeof memory.timeAware !== 'boolean') return false;

    // Validate commands
    for (const command of settings.commands) {
      if (!command.name || typeof command.name !== 'string') return false;
      if (typeof command.enabled !== 'boolean') return false;
    }

    return true;
  }
}
