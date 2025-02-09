import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';
import { inactiveGuilds } from './activate';

export const deactivateCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('deactivate')
    .setDescription('Deactivate the bot in this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for deactivating the bot')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const guildId = interaction.guildId!;
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (inactiveGuilds.has(guildId)) {
        await interaction.reply({
          content: 'The bot is already inactive in this server!',
          ephemeral: true
        });
        return;
      }

      // Add guild to inactive list
      inactiveGuilds.add(guildId);

      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('🔴 Bot Deactivated')
        .setDescription(
          'Shapes has been deactivated in this server. ' +
          'I will no longer respond to commands or messages until reactivated.'
        )
        .addFields(
          {
            name: '📝 Deactivation Reason',
            value: reason
          },
          {
            name: '🔄 Reactivation',
            value: 'To reactivate the bot, use the `/activate` command.'
          },
          {
            name: '⚠️ Note',
            value: 'Server settings and configurations will be preserved while the bot is inactive.'
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Shapes - Your AI companion' });

      await interaction.reply({ embeds: [embed] });

      // Log deactivation
      logger.info('Bot deactivated in guild:', {
        guildId,
        guildName: interaction.guild?.name,
        deactivatedBy: interaction.user.id,
        reason
      });

      // Optional: Clean up any active processes or connections for this guild
      await cleanupGuildResources(guildId);

    } catch (error) {
      logger.error('Error executing deactivate command:', error);
      await interaction.reply({
        content: 'There was an error deactivating the bot. Please try again later.',
        ephemeral: true
      });
    }
  },

  // Add a 60-second cooldown
  cooldown: 60,
  
  // Require Manage Server permission
  permissions: [PermissionFlagsBits.ManageGuild]
};

async function cleanupGuildResources(guildId: string): Promise<void> {
  try {
    // TODO: Implement cleanup logic
    // Examples of what might need cleanup:
    // - Clear any active cooldowns for the guild
    // - Stop any ongoing operations or tasks
    // - Close any open connections
    // - Clear any cached data

    logger.debug('Cleaned up resources for guild:', {
      guildId
    });
  } catch (error) {
    logger.error('Error cleaning up guild resources:', {
      error,
      guildId
    });
  }
}
