import { SlashCommandBuilder } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

export const data = new SlashCommandBuilder()
  .setName('dashboard')
  .setDescription('Accesses the dashboard.');

export const execute = async (interaction: any) => {
  const port = process.env.WEB_ADMIN_PORT || 3000;
  const dashboardUrl = `http://localhost:${port}`;
  await interaction.reply(`Access the dashboard at: ${dashboardUrl}`);
};
