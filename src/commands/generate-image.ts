import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('generate-image')
  .setDescription('Generates an image.');

export const execute = async (interaction: any) => {
  await interaction.reply('Image generated!');
};
