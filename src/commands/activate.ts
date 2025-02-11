import { SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../utils/ExtendedClient';

export const data = new SlashCommandBuilder()
  .setName('activate')
  .setDescription('Activates the bot.');

export const execute = async (interaction: any) => {
  const client = interaction.client as ExtendedClient;
  client.isActive = true;
  await interaction.reply('Bot activated!');
};
