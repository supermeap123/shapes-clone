import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('activate')
  .setDescription('Activate a specific feature or module.');

export async function execute(interaction: any) {
  await interaction.reply('Feature activated!');
}
