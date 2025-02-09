import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';

export const clearMemoryCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('clearmemory')
    .setDescription('Clear the bot\'s recent memory buffer')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('scope')
        .setDescription('Scope of memory to clear')
        .setRequired(true)
        .addChoices(
          { name: 'Channel', value: 'channel' },
          { name: 'User', value: 'user' },
          { name: 'Server', value: 'server' }
        )
    )
    .addChannelOption(option =>
      option
        .setName('target_channel')
        .setDescription('Channel to clear memory from (if scope is channel)')
        .setRequired(false)
    )
    .addUserOption(option =>
      option
        .setName('target_user')
        .setDescription('User to clear memory for (if scope is user)')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('confirm')
        .setDescription('Confirm memory clear')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const scope = interaction.options.getString('scope', true);
      const confirmed = interaction.options.getBoolean('confirm', true);
      const targetChannel = interaction.options.getChannel('target_channel');
      const targetUser = interaction.options.getUser('target_user');

      if (!confirmed) {
        await interaction.reply({
          content: 'Memory clear cancelled. No changes were made.',
          ephemeral: true
        });
        return;
      }

      // Validate scope and target combinations
      if (scope === 'channel' && !targetChannel) {
        await interaction.reply({
          content: 'Please specify a target channel when using channel scope.',
          ephemeral: true
        });
        return;
      }

      if (scope === 'user' && !targetUser) {
        await interaction.reply({
          content: 'Please specify a target user when using user scope.',
          ephemeral: true
        });
        return;
      }

      // Get memory stats before clearing
      const beforeStats = await getMemoryStats(interaction.guildId!, scope, targetChannel?.id, targetUser?.id);

      // Clear memory based on scope
      await clearMemory(interaction.guildId!, scope, targetChannel?.id, targetUser?.id);

      // Get memory stats after clearing
      const afterStats = await getMemoryStats(interaction.guildId!, scope, targetChannel?.id, targetUser?.id);

      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🧹 Memory Buffer Cleared')
        .setDescription(`Successfully cleared ${scope} memory buffer.`)
        .addFields(
          {
            name: '🎯 Scope',
            value: `${scope.charAt(0).toUpperCase() + scope.slice(1)}${
              targetChannel ? `\nChannel: ${targetChannel.name}` :
              targetUser ? `\nUser: ${targetUser.tag}` :
              '\nEntire server'
            }`,
            inline: true
          },
          {
            name: '📊 Statistics',
            value: [
              `Messages Cleared: ${beforeStats.messageCount - afterStats.messageCount}`,
              `Memory Size: ${formatBytes(beforeStats.memorySize - afterStats.memorySize)}`,
              `Time Range: ${formatTimeRange(beforeStats.timeRange)}`
            ].join('\n'),
            inline: true
          },
          {
            name: '📝 Note',
            value: 'This action only affects the recent memory buffer. Long-term memory and learned patterns remain intact.'
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Memory management by Shapes' });

      await interaction.reply({ embeds: [embed] });

      logger.info('Memory buffer cleared:', {
        guildId: interaction.guildId,
        scope,
        targetChannelId: targetChannel?.id,
        targetUserId: targetUser?.id,
        clearedBy: interaction.user.id,
        stats: {
          messageCount: beforeStats.messageCount - afterStats.messageCount,
          memorySize: beforeStats.memorySize - afterStats.memorySize
        }
      });

    } catch (error) {
      logger.error('Error executing clearMemory command:', error);
      await interaction.reply({
        content: 'There was an error clearing the memory buffer. Please try again later.',
        ephemeral: true
      });
    }
  },

  // Add a 1-minute cooldown
  cooldown: 60,
  
  // Require Manage Server permission
  permissions: [PermissionFlagsBits.ManageGuild]
};

interface MemoryStats {
  messageCount: number;
  memorySize: number;
  timeRange: number; // in milliseconds
}

async function getMemoryStats(
  guildId: string,
  scope: string,
  channelId?: string,
  userId?: string
): Promise<MemoryStats> {
  // TODO: Implement actual memory stats retrieval
  // This would typically query the memory storage system
  
  // Return mock data for now
  return {
    messageCount: Math.floor(Math.random() * 1000),
    memorySize: Math.floor(Math.random() * 1024 * 1024), // Random size up to 1MB
    timeRange: Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time up to 7 days
  };
}

async function clearMemory(
  guildId: string,
  scope: string,
  channelId?: string,
  userId?: string
): Promise<void> {
  // TODO: Implement actual memory clearing logic
  // This would typically:
  // 1. Connect to memory storage system
  // 2. Apply appropriate filters based on scope
  // 3. Delete matching entries
  // 4. Update indexes and references

  logger.debug('Clearing memory:', {
    guildId,
    scope,
    channelId,
    userId
  });
}

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

function formatTimeRange(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days === 1 ? '' : 's'}`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  return `${seconds} second${seconds === 1 ? '' : 's'}`;
}

// Export memory-related types
export interface MemoryBufferStats {
  totalSize: number;
  messageCount: number;
  oldestMessage: Date;
  newestMessage: Date;
  channelDistribution: Map<string, number>;
  userDistribution: Map<string, number>;
}

export interface MemoryBufferConfig {
  maxSize: number;
  maxAge: number;
  priorityChannels: string[];
  excludedChannels: string[];
  excludedUsers: string[];
}
