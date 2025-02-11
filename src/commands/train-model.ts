import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('train-model')
  .setDescription('Trains the machine learning model.');

export const execute = async (interaction: any) => {
  console.log('Model training initiated by:', interaction.user.tag);
  await interaction.reply('Model training initiated!');
};
