import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('debug')
  .setDescription('Initiates a debugging session.');

export const execute = async (interaction: any) => {
  await interaction.reply('Debugging session initiated!');
};
