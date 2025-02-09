import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { env } from './config/env';
import { setupBot } from './discord/setup';
import { startWebServer } from './web/server';
import { setupLogger } from './utils/logger';

const logger = setupLogger();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildModeration
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember
  ]
});

async function main() {
  try {
    // Initialize Discord bot
    await setupBot(client);
    
    // Start web server
    await startWebServer();
    
    // Login to Discord
    await client.login(env.DISCORD_TOKEN);
    
    logger.info('Shapes clone is now online!');
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();

// Handle process termination
process.on('SIGINT', () => {
  logger.info('Shutting down...');
  client.destroy();
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection:', error);
});
