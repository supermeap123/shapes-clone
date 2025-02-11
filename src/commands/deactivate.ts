import { SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../utils/ExtendedClient';

export const data = new SlashCommandBuilder()
  .setName('deactivate')
  .setDescription('Deactivates the bot.');

export const execute = async (interaction: any) => {
  const client = interaction.client as ExtendedClient;
  client.isActive = false;
  await interaction.reply('Bot deactivated!');
};
