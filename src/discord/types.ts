import { 
  AutocompleteInteraction,
  ChatInputCommandInteraction, 
  Client, 
  PermissionResolvable,
  SlashCommandBuilder
} from 'discord.js';

export interface CommandHandler {
  data: SlashCommandBuilder | any;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
  permissions?: PermissionResolvable[];
  cooldown?: number; // Cooldown in seconds
}

export interface EventHandler {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => Promise<void>;
}

export interface BotConfig {
  name: string;
  description: string;
  personality: PersonalityConfig;
  settings: BotSettings;
}

export interface PersonalityConfig {
  backstory: string;
  traits: string[];
  tone: string;
  likes: string[];
  dislikes: string[];
  conversationStyle: string;
}

export interface BotSettings {
  enableDMs: boolean;
  showServerList: boolean;
  errorMessages: {
    default: string;
    permissionDenied: string;
    cooldown: string;
  };
  welcomeMessage: string;
  memoryUpdateMessage: string;
  serverJoinMessage: string;
  chatRevivalThreshold: number; // Minutes of inactivity before chat revival
  maxResponseLength: number;
  aiConfig: AIConfig;
}

export interface AIConfig {
  primaryModel: string;
  fallbackModel: string;
  temperature: number;
  maxTokens: number;
  memoryRetention: number; // Number of messages to retain
  timeAware: boolean;
  timezone: string;
}

export interface Command {
  name: string;
  description: string;
  category: CommandCategory;
  handler: CommandHandler;
}

export enum CommandCategory {
  GENERAL = 'General',
  MODERATION = 'Moderation',
  UTILITY = 'Utility',
  CONFIGURATION = 'Configuration',
  FUN = 'Fun'
}

export interface CommandRegistration {
  register: (client: Client) => Promise<CommandHandler[]>;
}
