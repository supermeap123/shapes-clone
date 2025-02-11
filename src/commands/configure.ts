import { SlashCommandBuilder } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

export const data = new SlashCommandBuilder()
  .setName('configure')
  .setDescription('Configures the bot settings.');

export const execute = async (interaction: any) => {
  const config = `
\`\`\`
${process.env.DISCORD_BOT_TOKEN ? `DISCORD_BOT_TOKEN=${process.env.DISCORD_BOT_TOKEN}` : ''}
${process.env.DISCORD_INTENTS ? `DISCORD_INTENTS=${process.env.DISCORD_INTENTS}` : ''}
${process.env.DISCORD_PERMISSIONS ? `DISCORD_PERMISSIONS=${process.env.DISCORD_PERMISSIONS}` : ''}
${process.env.OPENROUTER_API_KEY ? `OPENROUTER_API_KEY=${process.env.OPENROUTER_API_KEY}` : ''}
${process.env.OPENROUTER_RATE_LIMIT ? `OPENROUTER_RATE_LIMIT=${process.env.OPENROUTER_RATE_LIMIT}` : ''}
${process.env.WEB_ADMIN_PORT ? `WEB_ADMIN_PORT=${process.env.WEB_ADMIN_PORT}` : ''}
${process.env.WEB_ADMIN_SECRET ? `WEB_ADMIN_SECRET=${process.env.WEB_ADMIN_SECRET}` : ''}
${process.env.DEBUG_MODE ? `DEBUG_MODE=${process.env.DEBUG_MODE}` : ''}
\`\`\`
  `;
  await interaction.reply(`Bot settings: ${config}`);
};
