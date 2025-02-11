import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('train-model')
  .setDescription('Trains the machine learning model.');

export const execute = async (interaction: any) => {
  await interaction.reply('Model training initiated!');
};
