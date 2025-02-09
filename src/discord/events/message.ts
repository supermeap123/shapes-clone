import { Message, ChannelType } from 'discord.js';
import { logger } from '../../utils/logger';
import { env } from '../../config/env';

// Track last message timestamps per channel
const lastMessageTimestamps = new Map<string, number>();

export async function handleMessageCreate(message: Message): Promise<void> {
  try {
    // Ignore bot messages
    if (message.author.bot) return;

    // Handle DMs if enabled
    if (message.channel.type === ChannelType.DM) {
      if (!env.ENABLE_DMS) {
        await message.reply('Direct messages are currently disabled.');
        return;
      }
      await handleDirectMessage(message);
      return;
    }

    // Update last message timestamp for the channel
    lastMessageTimestamps.set(message.channelId, Date.now());

    // Handle regular channel messages
    await handleChannelMessage(message);

  } catch (error) {
    logger.error('Error handling message:', {
      error,
      channelId: message.channelId,
      authorId: message.author.id
    });
  }
}

async function handleDirectMessage(message: Message): Promise<void> {
  try {
    // TODO: Implement DM handling with AI response
    logger.info('Received DM:', {
      content: message.content,
      authorId: message.author.id
    });

  } catch (error) {
    logger.error('Error handling DM:', error);
    await message.reply('Sorry, I encountered an error processing your message.');
  }
}

async function handleChannelMessage(message: Message): Promise<void> {
  try {
    // Check if message mentions the bot
    const isMentioned = message.mentions.users.has(message.client.user!.id);
    
    if (isMentioned) {
      // TODO: Implement AI response for mentions
      logger.info('Bot mentioned:', {
        content: message.content,
        channelId: message.channelId,
        authorId: message.author.id
      });
    }

    // Check for chat revival
    await checkChatRevival(message);

  } catch (error) {
    logger.error('Error handling channel message:', error);
  }
}

async function checkChatRevival(message: Message): Promise<void> {
  try {
    const channelId = message.channelId;
    const lastTimestamp = lastMessageTimestamps.get(channelId);
    
    if (!lastTimestamp) return;

    const inactivityThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds
    const timeSinceLastMessage = Date.now() - lastTimestamp;

    if (timeSinceLastMessage >= inactivityThreshold) {
      // TODO: Implement chat revival logic
      logger.info('Chat revival triggered:', {
        channelId,
        inactivityDuration: timeSinceLastMessage
      });
    }

  } catch (error) {
    logger.error('Error checking chat revival:', error);
  }
}

// Memory management - clean up old timestamps periodically
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  for (const [channelId, timestamp] of lastMessageTimestamps.entries()) {
    if (now - timestamp > maxAge) {
      lastMessageTimestamps.delete(channelId);
    }
  }
}, 60 * 60 * 1000); // Run cleanup every hour
