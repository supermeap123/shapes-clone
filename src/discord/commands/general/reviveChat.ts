import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  TextChannel,
  ChannelType
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';

export const reviveChatCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('revivechat')
    .setDescription('Revive an inactive chat with an engaging prompt')
    .setDMPermission(false)
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to revive (defaults to current channel)')
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption(option =>
      option
        .setName('topic')
        .setDescription('Specific topic to discuss')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const targetChannel = (interaction.options.getChannel('channel') || interaction.channel) as TextChannel;
      const topic = interaction.options.getString('topic');

      if (!targetChannel) {
        await interaction.reply({
          content: 'Unable to find the specified channel.',
          ephemeral: true
        });
        return;
      }

      // Check if the channel is already active
      const lastMessage = await getLastMessageTimestamp(targetChannel);
      const inactivityDuration = Date.now() - lastMessage;
      const inactivityThreshold = 30 * 60 * 1000; // 30 minutes

      if (inactivityDuration < inactivityThreshold) {
        await interaction.reply({
          content: 'This chat is still active! Try again when the conversation has been quiet for a while.',
          ephemeral: true
        });
        return;
      }

      // Generate revival prompt
      const prompt = await generateRevivalPrompt(topic, targetChannel.name);

      // Send initial response
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('💫 Chat Revival')
        .setDescription('Initiating conversation revival...')
        .addFields(
          {
            name: '📍 Channel',
            value: `<#${targetChannel.id}>`,
            inline: true
          },
          {
            name: '⌛ Inactive For',
            value: formatDuration(inactivityDuration),
            inline: true
          }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });

      // Send the revival message
      const revivalEmbed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setDescription(prompt)
        .setFooter({ text: 'Chat revival by Shapes | Join the conversation!' });

      await targetChannel.send({ embeds: [revivalEmbed] });

      logger.info('Chat revival initiated:', {
        guildId: interaction.guildId,
        channelId: targetChannel.id,
        initiatedBy: interaction.user.id,
        topic,
        inactivityDuration
      });

    } catch (error) {
      logger.error('Error executing reviveChat command:', error);
      await interaction.reply({
        content: 'There was an error reviving the chat. Please try again later.',
        ephemeral: true
      });
    }
  },

  // Add a 5-minute cooldown
  cooldown: 300
};

async function getLastMessageTimestamp(channel: TextChannel): Promise<number> {
  try {
    const messages = await channel.messages.fetch({ limit: 1 });
    const lastMessage = messages.first();
    return lastMessage ? lastMessage.createdTimestamp : 0;
  } catch (error) {
    logger.error('Error fetching last message:', error);
    return 0;
  }
}

async function generateRevivalPrompt(topic?: string | null, channelName?: string): Promise<string> {
  // TODO: Implement AI-powered prompt generation
  // This would typically:
  // 1. Analyze channel context and recent messages
  // 2. Consider channel name and topic
  // 3. Generate relevant and engaging prompts
  
  const generalPrompts = [
    "What's the most interesting thing you've learned recently? 🤔",
    "If you could master any skill instantly, what would it be? ✨",
    "What's a technology you think will change everything in the next 10 years? 🚀",
    "What's your favorite way to relax after a long day? 😌",
    "If you could have dinner with any historical figure, who would it be and why? 🍽️"
  ];

  const topicPrompts: { [key: string]: string[] } = {
    gaming: [
      "What game has the best storyline you've ever experienced? 🎮",
      "Which upcoming game release are you most excited about? 🕹️",
      "What's your most memorable gaming moment? 🏆"
    ],
    tech: [
      "What's your take on AI and its future impact? 🤖",
      "Which tech gadget can't you live without? 📱",
      "What's the next big thing in technology? 💻"
    ],
    music: [
      "What song never fails to improve your mood? 🎵",
      "Which artist would you love to see live in concert? 🎸",
      "What's your go-to karaoke song? 🎤"
    ]
  };

  if (topic) {
    // Use topic-specific prompts if available
    const topicKey = Object.keys(topicPrompts).find(key => 
      topic.toLowerCase().includes(key)
    );
    if (topicKey) {
      const prompts = topicPrompts[topicKey];
      return prompts[Math.floor(Math.random() * prompts.length)];
    }
    
    // Generate a topic-specific question
    return `Let's talk about ${topic}! What are your thoughts on this topic? 💭`;
  }

  // Use channel name for context if available
  if (channelName) {
    const channelKey = Object.keys(topicPrompts).find(key =>
      channelName.toLowerCase().includes(key)
    );
    if (channelKey) {
      const prompts = topicPrompts[channelKey];
      return prompts[Math.floor(Math.random() * prompts.length)];
    }
  }

  // Fall back to general prompts
  return generalPrompts[Math.floor(Math.random() * generalPrompts.length)];
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days === 1 ? '' : 's'}`;
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  return `${seconds} second${seconds === 1 ? '' : 's'}`;
}

// Export revival-related types
export interface RevivalStats {
  totalRevived: number;
  successRate: number;
  averageResponseTime: number;
  mostActiveHours: number[];
}

export interface RevivalConfig {
  minInactivityTime: number;
  maxAttemptsPerDay: number;
  cooldownBetweenAttempts: number;
  blacklistedChannels: string[];
}
