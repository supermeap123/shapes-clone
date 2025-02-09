import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder 
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';

export const pingCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s response time')
    .setDMPermission(true),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      // Initial response
      const sent = await interaction.reply({ 
        content: 'Pinging...', 
        fetchReply: true 
      });

      // Calculate latencies
      const wsLatency = interaction.client.ws.ping;
      const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;

      // Create embed with ping information
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🏓 Pong!')
        .addFields(
          {
            name: 'WebSocket Latency',
            value: `${wsLatency}ms`,
            inline: true
          },
          {
            name: 'Roundtrip Latency',
            value: `${roundtripLatency}ms`,
            inline: true
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Shapes - Your AI companion' });

      // Edit the initial response with the embed
      await interaction.editReply({ content: '', embeds: [embed] });

      // Log the ping results
      logger.debug('Ping command executed:', {
        wsLatency,
        roundtripLatency,
        guildId: interaction.guildId,
        userId: interaction.user.id
      });

    } catch (error) {
      logger.error('Error executing ping command:', error);
      
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'There was an error while checking the ping!',
          ephemeral: true
        });
      } else {
        await interaction.editReply({
          content: 'There was an error while checking the ping!'
        });
      }
    }
  },

  // Optional: Add a 5-second cooldown
  cooldown: 5
};
