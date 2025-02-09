import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  PermissionFlagsBits,
  version as discordJsVersion
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';
import os from 'os';

export const debugCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Get diagnostic information about the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const client = interaction.client;
      const botUptime = Math.floor(client.uptime! / 1000); // Convert to seconds
      const systemUptime = os.uptime();
      const processUptime = Math.floor(process.uptime());

      // Calculate memory usage
      const processMemoryUsage = process.memoryUsage();
      const systemMemory = {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem()
      };

      // Format memory sizes
      const formatBytes = (bytes: number): string => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
      };

      // Format uptime
      const formatUptime = (seconds: number): string => {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((seconds % (60 * 60)) / 60);
        const remainingSeconds = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
      };

      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('🔧 Debug Information')
        .addFields(
          {
            name: '🤖 Bot Stats',
            value: [
              `**Uptime:** ${formatUptime(botUptime)}`,
              `**Servers:** ${client.guilds.cache.size}`,
              `**Users:** ${client.users.cache.size}`,
              `**Channels:** ${client.channels.cache.size}`,
              `**WS Ping:** ${client.ws.ping}ms`
            ].join('\n'),
            inline: false
          },
          {
            name: '💾 Memory Usage',
            value: [
              `**RSS:** ${formatBytes(processMemoryUsage.rss)}`,
              `**Heap Used:** ${formatBytes(processMemoryUsage.heapUsed)}`,
              `**Heap Total:** ${formatBytes(processMemoryUsage.heapTotal)}`,
              `**External:** ${formatBytes(processMemoryUsage.external)}`
            ].join('\n'),
            inline: true
          },
          {
            name: '💻 System Info',
            value: [
              `**Platform:** ${process.platform}`,
              `**Node.js:** ${process.version}`,
              `**Discord.js:** v${discordJsVersion}`,
              `**System Uptime:** ${formatUptime(systemUptime)}`,
              `**Process Uptime:** ${formatUptime(processUptime)}`
            ].join('\n'),
            inline: true
          },
          {
            name: '📊 System Memory',
            value: [
              `**Total:** ${formatBytes(systemMemory.total)}`,
              `**Used:** ${formatBytes(systemMemory.used)}`,
              `**Free:** ${formatBytes(systemMemory.free)}`
            ].join('\n'),
            inline: false
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Shapes - Your AI companion' });

      await interaction.reply({ 
        embeds: [embed],
        ephemeral: true
      });

      logger.info('Debug command executed:', {
        userId: interaction.user.id,
        guildId: interaction.guildId
      });

    } catch (error) {
      logger.error('Error executing debug command:', error);
      await interaction.reply({
        content: 'There was an error retrieving debug information.',
        ephemeral: true
      });
    }
  },

  // Add a 30-second cooldown
  cooldown: 30,
  
  // Require administrator permission
  permissions: [PermissionFlagsBits.Administrator]
};
