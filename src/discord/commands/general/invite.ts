import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  PermissionFlagsBits,
  OAuth2Scopes
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';
import { env } from '../../../config/env';

export const inviteCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get an invite link for the bot')
    .setDMPermission(true),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const client = interaction.client;

      // Generate invite link with necessary permissions
      const inviteLink = client.generateInvite({
        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
        permissions: [
          // General Permissions
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.SendMessagesInThreads,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.UseExternalEmojis,
          PermissionFlagsBits.AddReactions,
          PermissionFlagsBits.Connect,
          PermissionFlagsBits.Speak,
          
          // Moderation Permissions
          PermissionFlagsBits.KickMembers,
          PermissionFlagsBits.BanMembers,
          PermissionFlagsBits.ModerateMembers,
          PermissionFlagsBits.ManageMessages,
          PermissionFlagsBits.ManageThreads,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.ManageRoles
        ]
      });

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🔗 Invite Shapes to Your Server')
        .setDescription(
          'Click the link below to add Shapes to your Discord server. ' +
          'Make sure you have the necessary permissions to add bots!'
        )
        .addFields(
          {
            name: '🔐 Required Permissions',
            value: 'The invite link includes all permissions needed for full functionality. ' +
                  'You can review and adjust these permissions during the invite process.'
          },
          {
            name: '🌟 Features',
            value: '• Slash Commands\n' +
                  '• Moderation Tools\n' +
                  '• AI Conversations\n' +
                  '• Custom Configurations'
          },
          {
            name: '🔗 Invite Link',
            value: `[Click here to invite Shapes](${inviteLink})`
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Shapes - Your AI companion' });

      await interaction.reply({ 
        embeds: [embed],
        ephemeral: !env.ENABLE_SERVER_LISTING // Make response private if server listing is disabled
      });

      logger.info('Invite command executed:', {
        userId: interaction.user.id,
        guildId: interaction.guildId
      });

    } catch (error) {
      logger.error('Error executing invite command:', error);
      await interaction.reply({
        content: 'There was an error generating the invite link. Please try again later.',
        ephemeral: true
      });
    }
  },

  // Add a 30-second cooldown
  cooldown: 30
};
