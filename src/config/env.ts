import dotenv from 'dotenv';
import { cleanEnv, str, bool, num } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  // Discord Configuration
  DISCORD_TOKEN: str(),
  CLIENT_ID: str(),
  
  // Web Server Configuration
  PORT: num({ default: 3000 }),
  
  // OpenRouter Configuration
  OPENROUTER_API_KEY: str(),
  
  // Feature Flags
  ENABLE_DMS: bool({ default: false }),
  ENABLE_SERVER_LISTING: bool({ default: false }),
  
  // Development
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' })
});
