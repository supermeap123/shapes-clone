import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';
import { env } from '../../../config/env';

export const dashboardCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Get a link to the web administration dashboard')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const guildId = interaction.guildId!;
      const dashboardUrl = `http://localhost:${env.PORT}/dashboard/${guildId}`;

      // Generate a temporary access token for the dashboard
      const accessToken = await generateDashboardToken(interaction);

      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🎛️ Administration Dashboard')
        .setDescription(
          'Access the web administration dashboard to configure and manage the bot. ' +
          'This link is valid for 15 minutes and is unique to you.'
        )
        .addFields(
          {
            name: '🔐 Security Note',
            value: 'Never share your dashboard access link with others. ' +
                  'Each administrator should generate their own link using this command.'
          },
          {
            name: '⚙️ Available Settings',
            value: [
              '• Bot Configuration',
              '• AI Model Settings',
              '• Command Management',
              '• Personality Customization',
              '• Memory Settings',
              '• Server-specific Options'
            ].join('\n')
          },
          {
            name: '🔗 Dashboard Link',
            value: `[Click here to access the dashboard](${dashboardUrl}?token=${accessToken})`
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Shapes - Your AI companion' });

      await interaction.reply({ 
        embeds: [embed],
        ephemeral: true // Always send as ephemeral for security
      });

      logger.info('Dashboard link generated:', {
        userId: interaction.user.id,
        guildId: interaction.guildId,
        tokenExpiry: '15 minutes'
      });

    } catch (error) {
      logger.error('Error executing dashboard command:', error);
      await interaction.reply({
        content: 'There was an error generating the dashboard link. Please try again later.',
        ephemeral: true
      });
    }
  },

  // Add a 30-second cooldown
  cooldown: 30,
  
  // Require Manage Server permission
  permissions: [PermissionFlagsBits.ManageGuild]
};

async function generateDashboardToken(interaction: ChatInputCommandInteraction): Promise<string> {
  // TODO: Implement proper token generation and storage
  // This is a placeholder implementation
  const timestamp = Date.now();
  const userId = interaction.user.id;
  const guildId = interaction.guildId;
  
  // In a real implementation:
  // 1. Generate a secure random token
  // 2. Store it in a database with user info and expiry
  // 3. Set up proper authentication middleware in the web server
  // 4. Implement token revocation
  
  // For now, return a simple encoded string
  return Buffer.from(`${timestamp}:${userId}:${guildId}`).toString('base64');
}

// Export types for dashboard-related functionality
export interface DashboardToken {
  token: string;
  userId: string;
  guildId: string;
  expiresAt: Date;
}

export interface DashboardSession {
  userId: string;
  guildId: string;
  lastAccess: Date;
  permissions: string[];
}
