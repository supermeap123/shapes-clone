import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';

// In a real implementation, this would be stored in a database
const inactiveGuilds = new Set<string>();

export const activateCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('activate')
    .setDescription('Activate the bot in this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const guildId = interaction.guildId!;

      if (!inactiveGuilds.has(guildId)) {
        await interaction.reply({
          content: 'The bot is already active in this server!',
          ephemeral: true
        });
        return;
      }

      // Remove guild from inactive list
      inactiveGuilds.delete(guildId);

      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🟢 Bot Activated')
        .setDescription(
          'Shapes has been activated in this server. ' +
          'I will now respond to commands and messages as configured.'
        )
        .addFields(
          {
            name: '🎯 Next Steps',
            value: [
              '• Use `/help` to see available commands',
              '• Configure bot settings with `/config`',
              '• Set up channel permissions as needed'
            ].join('\n')
          },
          {
            name: '💡 Need Help?',
            value: 'If you need assistance, use `/help` or mention me in any channel.'
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Shapes - Your AI companion' });

      await interaction.reply({ embeds: [embed] });

      logger.info('Bot activated in guild:', {
        guildId,
        guildName: interaction.guild?.name,
        activatedBy: interaction.user.id
      });

    } catch (error) {
      logger.error('Error executing activate command:', error);
      await interaction.reply({
        content: 'There was an error activating the bot. Please try again later.',
        ephemeral: true
      });
    }
  },

  // Add a 60-second cooldown
  cooldown: 60,
  
  // Require Manage Server permission
  permissions: [PermissionFlagsBits.ManageGuild]
};

// Export the inactive guilds set for use in other commands
export { inactiveGuilds };
