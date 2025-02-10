import { Client, GatewayIntentBits } from 'discord.js';
import { registerCommands, handleInteraction } from './commands/index';
import { memoryManager } from './memory';
import { personalityManager } from './personality';
import { openRouterClient } from './openrouter';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  await registerCommands(process.env.CLIENT_ID!, process.env.DISCORD_BOT_TOKEN!);
});

client.on('interactionCreate', async (interaction) => {
  await handleInteraction(interaction);
});

import './web-admin';

client.login(process.env.DISCORD_BOT_TOKEN);
