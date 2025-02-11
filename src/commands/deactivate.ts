import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('deactivate')
  .setDescription('Deactivates the bot.');

export const execute = async (interaction: any) => {
  await interaction.reply('Bot deactivated!');
};
