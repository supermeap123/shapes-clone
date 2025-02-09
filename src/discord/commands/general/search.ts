import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} from 'discord.js';
import { CommandHandler } from '../../types';
import { logger } from '../../../utils/logger';

// TODO: In a real implementation, this would be fetched from a database
const shapeCategories = [
  'Conversation',
  'Moderation',
  'Entertainment',
  'Utility',
  'Custom'
];

export const searchCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for shapes and their capabilities')
    .setDMPermission(true)
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Search term or category')
        .setRequired(false)
        .addChoices(
          ...shapeCategories.map(category => ({
            name: category,
            value: category.toLowerCase()
          }))
        )
    )
    .addBooleanOption(option =>
      option
        .setName('detailed')
        .setDescription('Show detailed information')
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const query = interaction.options.getString('query')?.toLowerCase();
      const detailed = interaction.options.getBoolean('detailed') ?? false;

      if (!query) {
        // Show category overview if no query provided
        await showCategoryOverview(interaction);
        return;
      }

      // Search for shapes based on the query
      const results = await searchShapes(query, detailed);

      if (results.length === 0) {
        const embed = new EmbedBuilder()
          .setColor(0xFF0000)
          .setTitle('❌ No Results Found')
          .setDescription('No shapes found matching your search criteria.')
          .addFields({
            name: '💡 Suggestions',
            value: [
              '• Try using different keywords',
              '• Browse categories using `/search` without a query',
              '• Check the help command for available options'
            ].join('\n')
          })
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      await sendSearchResults(interaction, results, detailed);

      logger.info('Search command executed:', {
        userId: interaction.user.id,
        query,
        detailed,
        resultCount: results.length
      });

    } catch (error) {
      logger.error('Error executing search command:', error);
      await interaction.reply({
        content: 'There was an error processing your search. Please try again later.',
        ephemeral: true
      });
    }
  },

  // Add a 5-second cooldown
  cooldown: 5
};

async function showCategoryOverview(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🔍 Shape Categories')
    .setDescription('Browse available shape categories and their capabilities.')
    .addFields(
      {
        name: '💭 Conversation',
        value: 'Shapes specialized in natural language interaction and chat engagement.',
        inline: true
      },
      {
        name: '🛡️ Moderation',
        value: 'Shapes focused on server management and content moderation.',
        inline: true
      },
      {
        name: '🎮 Entertainment',
        value: 'Shapes designed for games, music, and fun activities.',
        inline: true
      },
      {
        name: '🔧 Utility',
        value: 'Shapes providing helpful tools and functionality.',
        inline: true
      },
      {
        name: '✨ Custom',
        value: 'Unique shapes with specialized capabilities.',
        inline: true
      }
    )
    .setFooter({ text: 'Use /search <category> for detailed information' });

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      ...shapeCategories.map(category => 
        new ButtonBuilder()
          .setCustomId(`search_${category.toLowerCase()}`)
          .setLabel(category)
          .setStyle(ButtonStyle.Primary)
      )
    );

  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true
  });
}

interface ShapeSearchResult {
  name: string;
  category: string;
  description: string;
  capabilities: string[];
  requirements?: string[];
  examples?: string[];
}

async function searchShapes(query: string, detailed: boolean): Promise<ShapeSearchResult[]> {
  // TODO: Implement actual shape search logic
  // This would typically involve:
  // 1. Querying a database of available shapes
  // 2. Filtering based on search criteria
  // 3. Sorting by relevance
  // 4. Applying any category filters

  // For now, return mock data
  return [
    {
      name: 'Conversation Assistant',
      category: 'Conversation',
      description: 'An AI-powered conversation partner for engaging discussions.',
      capabilities: [
        'Natural language processing',
        'Context awareness',
        'Memory retention',
        'Multi-topic expertise'
      ],
      requirements: [
        'Server memory allocation',
        'API access'
      ],
      examples: [
        '/chat "Tell me about quantum physics"',
        '/discuss "Latest technology trends"'
      ]
    }
  ];
}

async function sendSearchResults(
  interaction: ChatInputCommandInteraction,
  results: ShapeSearchResult[],
  detailed: boolean
) {
  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('🔍 Search Results')
    .setDescription(`Found ${results.length} shape${results.length === 1 ? '' : 's'} matching your criteria.`);

  for (const result of results) {
    const fieldValue = detailed
      ? [
          `**Description:** ${result.description}`,
          '',
          '**Capabilities:**',
          result.capabilities.map(c => `• ${c}`).join('\n'),
          '',
          result.requirements ? '**Requirements:**\n' + result.requirements.map(r => `• ${r}`).join('\n') : '',
          '',
          result.examples ? '**Examples:**\n' + result.examples.map(e => `\`${e}\``).join('\n') : ''
        ].filter(Boolean).join('\n')
      : result.description;

    embed.addFields({
      name: `${result.name} (${result.category})`,
      value: fieldValue
    });
  }

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('search_more')
        .setLabel('Load More')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(results.length < 10), // Disable if no more results
      new ButtonBuilder()
        .setCustomId('search_detailed')
        .setLabel(detailed ? 'Show Less' : 'Show Details')
        .setStyle(ButtonStyle.Secondary)
    );

  await interaction.reply({
    embeds: [embed],
    components: [row],
    ephemeral: true
  });
}
