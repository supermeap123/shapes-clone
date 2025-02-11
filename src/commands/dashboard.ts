import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('dashboard')
  .setDescription('Accesses the dashboard.');

export const execute = async (interaction: any) => {
  await interaction.reply('Dashboard accessed!');
};
