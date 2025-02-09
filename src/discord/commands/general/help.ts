import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder,
  Collection
} from 'discord.js';
import { CommandHandler, CommandCategory } from '../../types';
import { logger } from '../../../utils/logger';

export const helpCommand: CommandHandler = {
  data: new SlashCommandBuilder()
    .setDMPermission(true)
    .setName('help')
    .setDescription('Shows a list of available commands')
    .addStringOption(option =>
      option
        .setName('category')
        .setDescription('Specific command category to show')
        .setRequired(false)
        .addChoices(
          { name: 'General', value: CommandCategory.GENERAL },
          { name: 'Moderation', value: CommandCategory.MODERATION },
          { name: 'Utility', value: CommandCategory.UTILITY },
          { name: 'Configuration', value: CommandCategory.CONFIGURATION }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const category = interaction.options.getString('category');
      const commands = interaction.client.commands;
      
      if (category) {
        await sendCategoryHelp(interaction, commands, category);
      } else {
        await sendGeneralHelp(interaction, commands);
      }
    } catch (error) {
      logger.error('Error executing help command:', error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    }
  }
};

async function sendCategoryHelp(
  interaction: ChatInputCommandInteraction,
  commands: Collection<string, CommandHandler>,
  category: string
) {
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`${category} Commands`)
    .setDescription('Here are all the commands in this category:')
    .setTimestamp()
    .setFooter({ text: 'Shapes - Your AI companion' });

  const categoryCommands = Array.from(commands.values())
    .filter(cmd => {
      const cmdData = cmd.data.toJSON();
      return cmdData.name && cmdData.description;
    });

  if (categoryCommands.length === 0) {
    embed.setDescription('No commands found in this category.');
  } else {
    categoryCommands.forEach(cmd => {
      const cmdData = cmd.data.toJSON();
      embed.addFields({
        name: `/${cmdData.name}`,
        value: cmdData.description || 'No description available'
      });
    });
  }

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function sendGeneralHelp(
  interaction: ChatInputCommandInteraction,
  commands: Collection<string, CommandHandler>
) {
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Shapes Help')
    .setDescription('Here are all available command categories:')
    .addFields(
      {
        name: '🎯 General Commands',
        value: 'Basic commands for interacting with the bot\nUse `/help general` to see more',
        inline: true
      },
      {
        name: '🛡️ Moderation Commands',
        value: 'Commands for managing your server\nUse `/help moderation` to see more',
        inline: true
      },
      {
        name: '🔧 Utility Commands',
        value: 'Helpful utility commands\nUse `/help utility` to see more',
        inline: true
      },
      {
        name: '⚙️ Configuration Commands',
        value: 'Commands for configuring the bot\nUse `/help configuration` to see more',
        inline: true
      }
    )
    .addFields({
      name: '📝 Command Usage',
      value: 'Use `/help [category]` to see detailed information about specific command categories.'
    })
    .setTimestamp()
    .setFooter({ text: 'Shapes - Your AI companion' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
