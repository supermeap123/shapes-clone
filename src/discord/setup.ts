import { Client, Collection, REST, Routes } from 'discord.js';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { CommandHandler } from './types';
import { registerCommands } from './commands';
import { setupEventHandlers } from './events';

export async function setupBot(client: Client): Promise<void> {
  try {
    // Initialize commands collection
    client.commands = new Collection<string, CommandHandler>();

    // Register all commands
    const commands = await registerCommands(client);

    // Register commands with Discord API
    const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
    
    logger.info('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(env.CLIENT_ID),
      { body: commands.map(cmd => cmd.data.toJSON()) }
    );

    logger.info('Successfully reloaded application (/) commands.');

    // Setup event handlers
    setupEventHandlers(client);

    // Handle errors
    client.on('error', error => {
      logger.error('Discord client error:', error);
    });

    client.on('warn', warning => {
      logger.warn('Discord client warning:', warning);
    });

    client.on('debug', info => {
      logger.debug('Discord client debug:', info);
    });

  } catch (error) {
    logger.error('Error setting up Discord bot:', error);
    throw error;
  }
}

// Extend Discord.js types to include our custom properties
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, CommandHandler>;
  }
}
