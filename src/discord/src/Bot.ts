import { Client, GatewayIntentBits, Events } from 'discord.js';
import { shapeManager } from './services/ShapeManager';
import { MessageHandler } from './handlers/messageHandler';
import config from './config/config';

export class Bot {
  private static instance: Bot;
  private client: Client;
  private isReady: boolean = false;

  private constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    });

    this.setupEventHandlers();
  }

  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }
    return Bot.instance;
  }

  /**
   * Start the bot
   */
  public async start(): Promise<void> {
    try {
      // Initialize shape manager
      await shapeManager.initialize();

      // Log in to Discord
      await this.client.login(config.discord.token);

      console.log('Bot started successfully');
    } catch (error) {
      console.error('Failed to start bot:', error);
      throw error;
    }
  }

  /**
   * Stop the bot
   */
  public async stop(): Promise<void> {
    try {
      // Clean up shape manager
      shapeManager.cleanup();

      // Destroy Discord client
      if (this.client) {
        this.client.destroy();
      }

      console.log('Bot stopped successfully');
    } catch (error) {
      console.error('Error stopping bot:', error);
      throw error;
    }
  }

  /**
   * Set up event handlers
   */
  private setupEventHandlers(): void {
    // Ready event
    this.client.on(Events.ClientReady, () => {
      this.isReady = true;
      console.log(`Logged in as ${this.client.user?.tag}`);
    });

    // Message event
    this.client.on(Events.MessageCreate, async (message) => {
      if (this.isReady) {
        await MessageHandler.handleMessage(message);
      }
    });

    // Error event
    this.client.on(Events.Error, (error) => {
      console.error('Discord client error:', error);
    });

    // Warning event
    this.client.on(Events.Warn, (warning) => {
      console.warn('Discord client warning:', warning);
    });

    // Debug event (only in development)
    if (process.env.NODE_ENV === 'development') {
      this.client.on(Events.Debug, (info) => {
        console.debug('Discord client debug:', info);
      });
    }

    // Guild join event
    this.client.on(Events.GuildCreate, async (guild) => {
      console.log(`Joined new guild: ${guild.name} (${guild.id})`);
      // TODO: Implement guild join logic (e.g., send welcome message)
    });

    // Guild leave event
    this.client.on(Events.GuildDelete, (guild) => {
      console.log(`Left guild: ${guild.name} (${guild.id})`);
      // TODO: Implement guild leave logic (e.g., cleanup)
    });

    // Process termination events
    process.on('SIGINT', this.handleTermination.bind(this));
    process.on('SIGTERM', this.handleTermination.bind(this));
  }

  /**
   * Handle graceful shutdown
   */
  private async handleTermination(): Promise<void> {
    console.log('Received termination signal');
    try {
      await this.stop();
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  }

  /**
   * Get Discord client instance
   */
  public getClient(): Client {
    return this.client;
  }

  /**
   * Check if bot is ready
   */
  public isClientReady(): boolean {
    return this.isReady;
  }
}

export const bot = Bot.getInstance();
