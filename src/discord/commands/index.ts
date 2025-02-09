import { Client } from 'discord.js';
import { logger } from '../../utils/logger';
import { CommandHandler } from '../types';

// Import command categories
import { registerGeneralCommands } from './general';
import { registerModerationCommands } from './moderation';
import { registerUtilityCommands } from './utility';
import { registerConfigCommands } from './config';

export async function registerCommands(client: Client): Promise<CommandHandler[]> {
  try {
    const commands: CommandHandler[] = [];

    // Register commands from each category
    const generalCommands = await registerGeneralCommands(client);
    const moderationCommands = await registerModerationCommands(client);
    const utilityCommands = await registerUtilityCommands(client);
    const configCommands = await registerConfigCommands(client);

    commands.push(
      ...generalCommands,
      ...moderationCommands,
      ...utilityCommands,
      ...configCommands
    );

    // Add commands to client's commands collection
    for (const command of commands) {
      client.commands.set(command.data.name, command);
      logger.debug(`Registered command: ${command.data.name}`);
    }

    logger.info(`Successfully registered ${commands.length} commands`);
    return commands;

  } catch (error) {
    logger.error('Error registering commands:', error);
    throw error;
  }
}

// Helper function to validate command structure
export function validateCommand(command: CommandHandler): boolean {
  const requiredProperties = ['data', 'execute'];
  
  for (const prop of requiredProperties) {
    if (!(prop in command)) {
      logger.error(`Command missing required property: ${prop}`);
      return false;
    }
  }

  if (typeof command.execute !== 'function') {
    logger.error('Command execute property must be a function');
    return false;
  }

  if (!command.data.name || !command.data.description) {
    logger.error('Command data must include name and description');
    return false;
  }

  return true;
}

// Helper function to create command category registration
export function createCommandRegistration(
  commands: CommandHandler[],
  category: string
): (client: Client) => Promise<CommandHandler[]> {
  return async (client: Client) => {
    const validCommands = commands.filter(cmd => {
      const isValid = validateCommand(cmd);
      if (!isValid) {
        logger.warn(`Invalid command in ${category} category:`, cmd.data?.name || 'unknown');
      }
      return isValid;
    });

    logger.debug(`Registered ${validCommands.length} commands in ${category} category`);
    return validCommands;
  };
}
