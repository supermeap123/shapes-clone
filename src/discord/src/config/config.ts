import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface Config {
  discord: {
    token: string;
    clientId: string;
    guildId: string;
  };
  database: {
    uri: string;
  };
  openRouter: {
    apiKey: string;
    apiUrl: string;
  };
  webUI: {
    apiUrl: string;
    apiKey: string;
  };
  memory: {
    retentionDays: number;
    shortTermLimit: number;
    longTermLimit: number;
  };
  logging: {
    level: string;
  };
}

// Validate required environment variables
const requiredEnvVars = [
  'DISCORD_TOKEN',
  'DISCORD_CLIENT_ID',
  'DISCORD_GUILD_ID',
  'MONGODB_URI',
  'OPENROUTER_API_KEY',
  'OPENROUTER_API_URL',
  'WEBUI_API_URL',
  'WEBUI_API_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Configuration object
const config: Config = {
  discord: {
    token: process.env.DISCORD_TOKEN!,
    clientId: process.env.DISCORD_CLIENT_ID!,
    guildId: process.env.DISCORD_GUILD_ID!,
  },
  database: {
    uri: process.env.MONGODB_URI!,
  },
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY!,
    apiUrl: process.env.OPENROUTER_API_URL!,
  },
  webUI: {
    apiUrl: process.env.WEBUI_API_URL!,
    apiKey: process.env.WEBUI_API_KEY!,
  },
  memory: {
    retentionDays: parseInt(process.env.MEMORY_RETENTION_DAYS || '30', 10),
    shortTermLimit: parseInt(process.env.SHORT_TERM_MEMORY_LIMIT || '10', 10),
    longTermLimit: parseInt(process.env.LONG_TERM_MEMORY_LIMIT || '100', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export default config;
