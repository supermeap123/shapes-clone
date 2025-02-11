import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('configure')
  .setDescription('Configures the bot settings.');

export const execute = async (interaction: any) => {
  await interaction.reply('Bot settings configured!');
};
