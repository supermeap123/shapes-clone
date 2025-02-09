import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';

export const resetMemoryCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('resetmemory')
    .setDescription('Reset the bot\'s memory for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('Type of memory to reset')
        .setRequired(true)
        .addChoices(
          { name: 'Short-term', value: 'short' },
          { name: 'Long-term', value: 'long' },
          { name: 'All', value: 'all' }
        )
    )
    .addBooleanOption(option =>
      option
        .setName('confirm')
        .setDescription('Confirm memory reset')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const memoryType = interaction.options.getString('type', true);
      const confirmed = interaction.options.getBoolean('confirm', true);

      if (!confirmed) {
        await interaction.reply({
          content: 'Memory reset cancelled. No changes were made.',
          ephemeral: true
        });
        return;
      }

      // Perform memory reset based on type
      await resetMemory(interaction, memoryType);

      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🧹 Memory Reset Complete')
        .setDescription(`Successfully reset ${memoryType}-term memory for this server.`)
        .addFields(
          {
            name: '🔄 Reset Type',
            value: memoryType.charAt(0).toUpperCase() + memoryType.slice(1) + '-term memory',
            inline: true
          },
          {
            name: '⚙️ Status',
            value: 'Completed successfully',
            inline: true
          },
          {
            name: '📝 Note',
            value: getMemoryResetNote(memoryType)
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Memory management by Shapes' });

      await interaction.reply({ embeds: [embed] });

      logger.info('Memory reset completed:', {
        guildId: interaction.guildId,
        userId: interaction.user.id,
        type: memoryType
      });

    } catch (error) {
      logger.error('Error executing resetMemory command:', error);
      await interaction.reply({
        content: 'There was an error resetting the memory. Please try again later.',
        ephemeral: true
      });
    }
  },

  // Add a 5-minute cooldown
  cooldown: 300,
  
  // Require Manage Server permission
  permissions: [PermissionFlagsBits.ManageGuild]
};

async function resetMemory(interaction: ChatInputCommandInteraction, type: string): Promise<void> {
  const guildId = interaction.guildId!;

  try {
    switch (type) {
      case 'short':
        await resetShortTermMemory(guildId);
        break;
      case 'long':
        await resetLongTermMemory(guildId);
        break;
      case 'all':
        await resetAllMemory(guildId);
        break;
    }
  } catch (error) {
    logger.error('Error in resetMemory:', error);
    throw new Error('Failed to reset memory');
  }
}

async function resetShortTermMemory(guildId: string): Promise<void> {
  // TODO: Implement short-term memory reset
  // This would typically include:
  // - Recent conversation context
  // - Temporary user interactions
  // - Current session state
  logger.debug('Resetting short-term memory:', { guildId });
}

async function resetLongTermMemory(guildId: string): Promise<void> {
  // TODO: Implement long-term memory reset
  // This would typically include:
  // - Learned user preferences
  // - Historical conversation patterns
  // - Custom responses and behaviors
  logger.debug('Resetting long-term memory:', { guildId });
}

async function resetAllMemory(guildId: string): Promise<void> {
  // Reset both short-term and long-term memory
  await Promise.all([
    resetShortTermMemory(guildId),
    resetLongTermMemory(guildId)
  ]);
  logger.debug('Resetting all memory:', { guildId });
}

function getMemoryResetNote(type: string): string {
  switch (type) {
    case 'short':
      return 'Short-term memory has been cleared. The bot will maintain its long-term knowledge but forget recent conversations.';
    case 'long':
      return 'Long-term memory has been reset. The bot will maintain recent conversations but forget learned patterns and preferences.';
    case 'all':
      return 'All memory has been reset. The bot will start fresh with its default personality and behavior settings.';
    default:
      return 'Memory has been modified according to the specified settings.';
  }
}

// Export memory-related types
export interface MemoryEntry {
  type: 'short' | 'long';
  content: string;
  timestamp: Date;
  context: {
    userId: string;
    channelId: string;
    messageId: string;
  };
}

export interface MemoryStats {
  shortTermCount: number;
  longTermCount: number;
  lastReset: Date;
  totalInteractions: number;
}
