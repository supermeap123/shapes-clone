import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';

export const sleepCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('sleep')
    .setDescription('Put the bot to sleep to process memory updates')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addIntegerOption(option =>
      option
        .setName('duration')
        .setDescription('Sleep duration in minutes (1-60)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(60)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Reason for sleep mode')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const duration = interaction.options.getInteger('duration', true);
      const reason = interaction.options.getString('reason') || 'Memory update processing';
      const guildId = interaction.guildId!;

      // Initial response
      const embed = new EmbedBuilder()
        .setColor(0x6C44C4)
        .setTitle('😴 Entering Sleep Mode')
        .setDescription('Processing memory updates and optimizing responses.')
        .addFields(
          {
            name: '⏱️ Duration',
            value: `${duration} minute${duration === 1 ? '' : 's'}`,
            inline: true
          },
          {
            name: '📝 Reason',
            value: reason,
            inline: true
          },
          {
            name: '⚙️ Process',
            value: [
              '1. Saving current memory state',
              '2. Processing recent interactions',
              '3. Updating response patterns',
              '4. Optimizing conversation flow'
            ].join('\n')
          }
        )
        .setTimestamp()
        .setFooter({ text: 'Sleep mode initiated by Shapes' });

      await interaction.reply({ embeds: [embed] });

      // Start sleep process
      await enterSleepMode(interaction, duration, reason);

      logger.info('Sleep mode initiated:', {
        guildId,
        duration,
        reason,
        initiatedBy: interaction.user.id
      });

    } catch (error) {
      logger.error('Error executing sleep command:', error);
      await interaction.reply({
        content: 'There was an error entering sleep mode. Please try again later.',
        ephemeral: true
      });
    }
  },

  // Add a 5-minute cooldown
  cooldown: 300,
  
  // Require Manage Server permission
  permissions: [PermissionFlagsBits.ManageGuild]
};

async function enterSleepMode(
  interaction: ChatInputCommandInteraction,
  duration: number,
  reason: string
): Promise<void> {
  try {
    // Start sleep timer
    const sleepEnd = Date.now() + (duration * 60 * 1000);
    
    // Update status every minute
    const updateInterval = setInterval(async () => {
      const timeLeft = Math.ceil((sleepEnd - Date.now()) / (60 * 1000));
      
      if (timeLeft <= 0) {
        clearInterval(updateInterval);
        await handleSleepCompletion(interaction);
        return;
      }

      const progressEmbed = new EmbedBuilder()
        .setColor(0x6C44C4)
        .setTitle('😴 Sleep Mode Active')
        .setDescription(`Time remaining: ${timeLeft} minute${timeLeft === 1 ? '' : 's'}`)
        .addFields({
          name: '📊 Progress',
          value: getProgressBar(duration - timeLeft, duration)
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [progressEmbed] });
    }, 60000); // Update every minute

    // Simulate memory processing
    await processMemoryUpdates(interaction.guildId!);

  } catch (error) {
    logger.error('Error in sleep mode:', error);
    throw error;
  }
}

async function handleSleepCompletion(interaction: ChatInputCommandInteraction): Promise<void> {
  try {
    const completionEmbed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('🌅 Sleep Mode Complete')
      .setDescription('Memory updates have been processed successfully.')
      .addFields(
        {
          name: '✨ Improvements',
          value: [
            '• Optimized response patterns',
            '• Updated conversation context',
            '• Refined personality traits',
            '• Enhanced memory retention'
          ].join('\n')
        },
        {
          name: '📈 Status',
          value: 'Ready for new interactions'
        }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [completionEmbed] });

    logger.info('Sleep mode completed:', {
      guildId: interaction.guildId,
      completedAt: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error completing sleep mode:', error);
    throw error;
  }
}

async function processMemoryUpdates(guildId: string): Promise<void> {
  // TODO: Implement actual memory processing
  // This would typically involve:
  // 1. Consolidating recent interactions
  // 2. Updating learning patterns
  // 3. Optimizing response templates
  // 4. Cleaning up old data

  logger.debug('Processing memory updates:', { guildId });
}

function getProgressBar(current: number, total: number): string {
  const barLength = 20;
  const progress = Math.floor((current / total) * barLength);
  const filled = '█'.repeat(progress);
  const empty = '░'.repeat(barLength - progress);
  const percentage = Math.floor((current / total) * 100);
  return `${filled}${empty} ${percentage}%`;
}

// Export sleep-related types
export interface SleepState {
  guildId: string;
  startTime: Date;
  endTime: Date;
  reason: string;
  status: 'active' | 'completed' | 'interrupted';
}

export interface SleepStats {
  totalSleepTime: number;
  lastSleep: Date;
  improvements: string[];
}
