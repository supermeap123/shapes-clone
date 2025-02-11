import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('invite')
  .setDescription('Retrieves an invite link.');

export const execute = async (interaction: any) => {
  await interaction.reply('Invite link retrieved!');
};
