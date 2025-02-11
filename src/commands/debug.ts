import { SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../utils/ExtendedClient';
import * as dotenv from 'dotenv';
dotenv.config();

export const data = new SlashCommandBuilder()
  .setName('debug')
  .setDescription('Initiates a debugging session.');

export const execute = async (interaction: any) => {
  const client = interaction.client as ExtendedClient;

  const commandStates = Array.from(client.commands.keys()).join(', ');
  const shapes = JSON.stringify(client.shapes, null, 2);
  const discordBotToken = process.env.DISCORD_BOT_TOKEN ? 'Present' : 'Not present';
  const openRouterApiKey = process.env.OPENROUTER_API_KEY ? 'Present' : 'Not present';

  const debugInfo = `
\`\`\`
Command States: ${commandStates}
Shapes: ${shapes}
Discord Bot Token: ${discordBotToken}
OpenRouter API Key: ${openRouterApiKey}
\`\`\`
  `;

  await interaction.reply(debugInfo);
};
