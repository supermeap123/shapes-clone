import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

export const execute = async (interaction: any) => {
  const latency = Date.now() - interaction.createdTimestamp;
  await interaction.reply(`Pong! Latency is ${latency}ms`);
};
