import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../../.env') });

// Mock Discord.js classes and methods
jest.mock('discord.js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    login: jest.fn().mockResolvedValue('token'),
    destroy: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    commands: new Map(),
    ws: { ping: 42 }
  })),
  SlashCommandBuilder: jest.fn().mockImplementation(() => ({
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    addStringOption: jest.fn().mockReturnThis(),
    addIntegerOption: jest.fn().mockReturnThis(),
    addBooleanOption: jest.fn().mockReturnThis(),
    addUserOption: jest.fn().mockReturnThis(),
    addChannelOption: jest.fn().mockReturnThis(),
    addRoleOption: jest.fn().mockReturnThis(),
    addMentionableOption: jest.fn().mockReturnThis(),
    addNumberOption: jest.fn().mockReturnThis(),
    addAttachmentOption: jest.fn().mockReturnThis(),
    setDefaultMemberPermissions: jest.fn().mockReturnThis(),
    setDMPermission: jest.fn().mockReturnThis(),
    toJSON: jest.fn().mockReturnThis()
  })),
  EmbedBuilder: jest.fn().mockImplementation(() => ({
    setColor: jest.fn().mockReturnThis(),
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    addFields: jest.fn().mockReturnThis(),
    setTimestamp: jest.fn().mockReturnThis(),
    setFooter: jest.fn().mockReturnThis()
  })),
  PermissionFlagsBits: {
    Administrator: 8n,
    ManageGuild: 32n,
    ModerateMembers: 1099511627776n
  },
  ChannelType: {
    GuildText: 0,
    DM: 1
  },
  Collection: jest.fn().mockImplementation(() => new Map()),
  REST: jest.fn().mockImplementation(() => ({
    setToken: jest.fn().mockReturnThis(),
    put: jest.fn().mockResolvedValue(true)
  })),
  Routes: {
    applicationCommands: jest.fn()
  }
}));

// Mock Winston logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
