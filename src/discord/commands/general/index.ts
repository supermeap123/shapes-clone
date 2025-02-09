import { Client } from 'discord.js';
import { createCommandRegistration } from '../index';
import { CommandHandler } from '../../types';

// Import general commands
import { helpCommand } from './help';
import { pingCommand } from './ping';
import { inviteCommand } from './invite';
import { debugCommand } from './debug';
import { activateCommand } from './activate';
import { deactivateCommand } from './deactivate';
import { dashboardCommand } from './dashboard';
import { shapeCommand } from './shape';
import { resetMemoryCommand } from './resetMemory';
import { searchCommand } from './search';
import { sleepCommand } from './sleep';
import { clearMemoryCommand } from './clearMemory';
import { reviveChatCommand } from './reviveChat';

const generalCommands: CommandHandler[] = [
  helpCommand,
  pingCommand,
  inviteCommand,
  debugCommand,
  activateCommand,
  deactivateCommand,
  dashboardCommand,
  shapeCommand,
  resetMemoryCommand,
  searchCommand,
  sleepCommand,
  clearMemoryCommand,
  reviveChatCommand
];

export const registerGeneralCommands = createCommandRegistration(
  generalCommands,
  'General'
);

// Re-export commands for use in other modules
export {
  helpCommand,
  pingCommand,
  inviteCommand,
  debugCommand,
  activateCommand,
  deactivateCommand,
  dashboardCommand,
  shapeCommand,
  resetMemoryCommand,
  searchCommand,
  sleepCommand,
  clearMemoryCommand,
  reviveChatCommand
};
