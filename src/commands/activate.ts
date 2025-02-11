import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('activate')
  .setDescription('Activates the bot.');

export const execute = async (interaction: any) => {
  await interaction.reply('Bot activated!');
};
