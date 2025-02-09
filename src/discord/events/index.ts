import { Client } from 'discord.js';
import { logger } from '../../utils/logger';
import { EventHandler } from '../types';
import { handleInteraction } from './interaction';
import { handleMessageCreate } from './message';
import { handleGuildCreate } from './guild';

const events: EventHandler[] = [
  {
    name: 'interactionCreate',
    execute: handleInteraction
  },
  {
    name: 'messageCreate',
    execute: handleMessageCreate
  },
  {
    name: 'guildCreate',
    execute: handleGuildCreate
  },
  {
    name: 'ready',
    once: true,
    execute: async (client: Client) => {
      logger.info(`Ready! Logged in as ${client.user?.tag}`);
    }
  }
];

export function setupEventHandlers(client: Client): void {
  for (const event of events) {
    if (event.once) {
      client.once(event.name, (...args) => {
        event.execute(...args).catch(error => {
          logger.error(`Error in event ${event.name}:`, error);
        });
      });
    } else {
      client.on(event.name, (...args) => {
        event.execute(...args).catch(error => {
          logger.error(`Error in event ${event.name}:`, error);
        });
      });
    }
    logger.debug(`Registered event handler: ${event.name}`);
  }
}

export { handleInteraction } from './interaction';
export { handleMessageCreate } from './message';
export { handleGuildCreate } from './guild';
