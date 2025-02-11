import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('recommend')
  .setDescription('Generates a recommendation.');

export const execute = async (interaction: any) => {
  await interaction.reply('Recommendation generated!');
};
