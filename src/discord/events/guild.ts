import { Guild, TextChannel, ChannelType } from 'discord.js';
import { logger } from '../../utils/logger';
import { env } from '../../config/env';

export async function handleGuildCreate(guild: Guild): Promise<void> {
  try {
    logger.info('Bot joined new guild:', {
      guildId: guild.id,
      guildName: guild.name,
      memberCount: guild.memberCount
    });

    // Find the system channel or first available text channel
    const welcomeChannel = guild.systemChannel || 
      guild.channels.cache.find(
        channel => 
          channel.type === ChannelType.GuildText && 
          channel.permissionsFor(guild.members.me!)?.has('SendMessages')
      ) as TextChannel;

    if (welcomeChannel) {
      await sendWelcomeMessage(welcomeChannel);
    } else {
      logger.warn('Could not find suitable channel for welcome message:', {
        guildId: guild.id,
        guildName: guild.name
      });
    }

    // Initialize guild-specific settings
    await initializeGuildSettings(guild);

  } catch (error) {
    logger.error('Error handling guild create event:', {
      error,
      guildId: guild.id,
      guildName: guild.name
    });
  }
}

async function sendWelcomeMessage(channel: TextChannel): Promise<void> {
  try {
    const welcomeEmbed = {
      color: 0x0099ff,
      title: '👋 Hello, I\'m Shapes!',
      description: 'Thank you for inviting me to your server! I\'m here to help make your server more engaging and fun.',
      fields: [
        {
          name: '🎯 Getting Started',
          value: 'Use `/help` to see all available commands.'
        },
        {
          name: '⚙️ Configuration',
          value: 'Server administrators can use `/config` to customize my behavior.'
        },
        {
          name: '🤝 Support',
          value: 'If you need help, feel free to mention me in any channel.'
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Shapes - Your AI companion'
      }
    };

    await channel.send({ embeds: [welcomeEmbed] });
    
  } catch (error) {
    logger.error('Error sending welcome message:', {
      error,
      channelId: channel.id,
      guildId: channel.guild.id
    });
  }
}

async function initializeGuildSettings(guild: Guild): Promise<void> {
  try {
    // TODO: Initialize default settings in database
    logger.info('Initializing guild settings:', {
      guildId: guild.id,
      guildName: guild.name
    });

    // Default settings template
    const defaultSettings = {
      prefix: '/',
      welcomeEnabled: true,
      moderationEnabled: true,
      aiResponses: true,
      chatRevival: {
        enabled: true,
        threshold: 30 // minutes
      },
      allowedChannels: [],
      excludedChannels: [],
      customResponses: {}
    };

    // TODO: Save settings to database
    logger.debug('Default settings initialized:', {
      guildId: guild.id,
      settings: defaultSettings
    });

  } catch (error) {
    logger.error('Error initializing guild settings:', {
      error,
      guildId: guild.id,
      guildName: guild.name
    });
  }
}
