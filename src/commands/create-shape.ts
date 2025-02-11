import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('create-shape')
  .setDescription('Creates a new shape.');

export const execute = async (interaction: any) => {
  await interaction.reply('New shape created!');
};
