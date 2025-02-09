import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { CommandHandler, PersonalityConfig } from '../../types';
import { logger } from '../../../utils/logger';

export const shapeCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('shape')
    .setDescription('Customize the bot\'s personality and behavior')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View current personality settings')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('backstory')
        .setDescription('Set the bot\'s backstory')
        .addStringOption(option =>
          option
            .setName('story')
            .setDescription('The new backstory for the bot')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('trait')
        .setDescription('Add or remove personality traits')
        .addStringOption(option =>
          option
            .setName('action')
            .setDescription('Whether to add or remove the trait')
            .setRequired(true)
            .addChoices(
              { name: 'Add', value: 'add' },
              { name: 'Remove', value: 'remove' }
            )
        )
        .addStringOption(option =>
          option
            .setName('trait')
            .setDescription('The personality trait')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('tone')
        .setDescription('Set the bot\'s conversational tone')
        .addStringOption(option =>
          option
            .setName('style')
            .setDescription('The conversational style')
            .setRequired(true)
            .addChoices(
              { name: 'Casual', value: 'casual' },
              { name: 'Professional', value: 'professional' },
              { name: 'Friendly', value: 'friendly' },
              { name: 'Humorous', value: 'humorous' },
              { name: 'Formal', value: 'formal' }
            )
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
        case 'view':
          await handleViewPersonality(interaction);
          break;
        case 'backstory':
          await handleBackstoryUpdate(interaction);
          break;
        case 'trait':
          await handleTraitModification(interaction);
          break;
        case 'tone':
          await handleToneUpdate(interaction);
          break;
      }

    } catch (error) {
      logger.error('Error executing shape command:', error);
      await interaction.reply({
        content: 'There was an error updating the personality settings.',
        ephemeral: true
      });
    }
  },

  // Add a 10-second cooldown
  cooldown: 10,
  
  // Require Manage Server permission
  permissions: [PermissionFlagsBits.ManageGuild]
};

// TODO: In a real implementation, these would be stored in a database
let currentPersonality: PersonalityConfig = {
  backstory: 'A friendly AI assistant eager to help.',
  traits: ['helpful', 'friendly', 'knowledgeable'],
  tone: 'casual',
  likes: ['helping users', 'learning new things'],
  dislikes: ['rudeness', 'spam'],
  conversationStyle: 'adaptive'
};

async function handleViewPersonality(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🎭 Current Personality Settings')
    .addFields(
      {
        name: '📖 Backstory',
        value: currentPersonality.backstory
      },
      {
        name: '✨ Traits',
        value: currentPersonality.traits.join(', ') || 'No traits set'
      },
      {
        name: '🗣️ Conversational Tone',
        value: currentPersonality.tone.charAt(0).toUpperCase() + currentPersonality.tone.slice(1)
      },
      {
        name: '👍 Likes',
        value: currentPersonality.likes.join(', ') || 'No preferences set'
      },
      {
        name: '👎 Dislikes',
        value: currentPersonality.dislikes.join(', ') || 'No preferences set'
      }
    )
    .setTimestamp()
    .setFooter({ text: 'Use /shape commands to modify these settings' });

  await interaction.reply({ embeds: [embed] });
}

async function handleBackstoryUpdate(interaction: ChatInputCommandInteraction) {
  const newBackstory = interaction.options.getString('story', true);
  
  // Update backstory
  currentPersonality.backstory = newBackstory;

  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('📖 Backstory Updated')
    .setDescription('The bot\'s backstory has been updated successfully.')
    .addFields({
      name: 'New Backstory',
      value: newBackstory
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
  
  logger.info('Backstory updated:', {
    guildId: interaction.guildId,
    updatedBy: interaction.user.id
  });
}

async function handleTraitModification(interaction: ChatInputCommandInteraction) {
  const action = interaction.options.getString('action', true);
  const trait = interaction.options.getString('trait', true).toLowerCase();

  if (action === 'add') {
    if (!currentPersonality.traits.includes(trait)) {
      currentPersonality.traits.push(trait);
    }
  } else {
    currentPersonality.traits = currentPersonality.traits.filter(t => t !== trait);
  }

  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('✨ Traits Updated')
    .setDescription(`Successfully ${action}ed trait: ${trait}`)
    .addFields({
      name: 'Current Traits',
      value: currentPersonality.traits.join(', ') || 'No traits set'
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
  
  logger.info('Traits updated:', {
    guildId: interaction.guildId,
    updatedBy: interaction.user.id,
    action,
    trait
  });
}

async function handleToneUpdate(interaction: ChatInputCommandInteraction) {
  const newTone = interaction.options.getString('style', true);
  
  // Update tone
  currentPersonality.tone = newTone;

  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('🗣️ Conversational Tone Updated')
    .setDescription(`The bot's tone has been set to: ${newTone}`)
    .addFields({
      name: 'Effect',
      value: 'This change will affect how the bot communicates in all future interactions.'
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
  
  logger.info('Tone updated:', {
    guildId: interaction.guildId,
    updatedBy: interaction.user.id,
    newTone
  });
}
