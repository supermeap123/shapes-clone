import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('invite')
  .setDescription('Retrieves an invite link.');

export const execute = async (interaction: any) => {
  const clientId = interaction.client.user.id;
  const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;
  await interaction.reply(`Invite the bot using this link: ${inviteLink}`);
};
