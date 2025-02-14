import axios from 'axios';
import { EventEmitter } from 'events';
import config from '../config/config';
import { IShape } from '../types/shape';

interface ShapeCache {
  [key: string]: IShape;
}

class ShapeManager extends EventEmitter {
  private static instance: ShapeManager;
  private shapes: ShapeCache = {};
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly syncIntervalMs = 30000; // Sync every 30 seconds

  private constructor() {
    super();
  }

  public static getInstance(): ShapeManager {
    if (!ShapeManager.instance) {
      ShapeManager.instance = new ShapeManager();
    }
    return ShapeManager.instance;
  }

  /**
   * Initialize the shape manager and start syncing
   */
  public async initialize(): Promise<void> {
    try {
      await this.loadShapes();
      this.startSync();
    } catch (error) {
      console.error('Failed to initialize ShapeManager:', error);
      throw error;
    }
  }

  /**
   * Load all active shapes from the Web UI
   */
  private async loadShapes(): Promise<void> {
    try {
      const response = await axios.get(`${config.webUI.apiUrl}/shapes`, {
        headers: {
          'Authorization': `Bearer ${config.webUI.apiKey}`,
        },
      });

      const newShapes: ShapeCache = {};
      for (const shape of response.data) {
        newShapes[shape.vanityUrl] = shape;
      }

      // Check for changes and emit events
      for (const [vanityUrl, shape] of Object.entries(newShapes)) {
        const existingShape = this.shapes[vanityUrl];
        if (!existingShape) {
          this.emit('shapeAdded', shape);
        } else if (JSON.stringify(existingShape) !== JSON.stringify(shape)) {
          this.emit('shapeUpdated', shape);
        }
      }

      // Check for removed shapes
      for (const vanityUrl of Object.keys(this.shapes)) {
        if (!newShapes[vanityUrl]) {
          this.emit('shapeRemoved', this.shapes[vanityUrl]);
        }
      }

      this.shapes = newShapes;
    } catch (error) {
      console.error('Failed to load shapes:', error);
      throw error;
    }
  }

  /**
   * Start the sync interval
   */
  private startSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      try {
        await this.loadShapes();
      } catch (error) {
        console.error('Failed to sync shapes:', error);
      }
    }, this.syncIntervalMs);
  }

  /**
   * Stop the sync interval
   */
  public stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Get a shape by its vanity URL
   */
  public getShape(vanityUrl: string): IShape | undefined {
    return this.shapes[vanityUrl];
  }

  /**
   * Get all loaded shapes
   */
  public getAllShapes(): IShape[] {
    return Object.values(this.shapes);
  }

  /**
   * Get shapes that can respond in a specific channel
   */
  public getShapesForChannel(channelId: string): IShape[] {
    return Object.values(this.shapes).filter(shape => {
      if (!shape.settings?.privacySettings) return true;
      const { ignoredChannels = [] } = shape.settings.privacySettings;
      return !ignoredChannels.includes(channelId);
    });
  }

  /**
   * Get shapes that can respond to a specific user
   */
  public getShapesForUser(userId: string): IShape[] {
    return Object.values(this.shapes).filter(shape => {
      if (!shape.settings?.privacySettings) return true;
      const { ignoredUsers = [] } = shape.settings.privacySettings;
      return !ignoredUsers.includes(userId);
    });
  }

  /**
   * Get shapes that can respond in DMs
   */
  public getShapesForDM(): IShape[] {
    return Object.values(this.shapes).filter(shape => {
      if (!shape.settings?.privacySettings?.dmResponseSettings) return true;
      return shape.settings.privacySettings.dmResponseSettings.enabled;
    });
  }

  /**
   * Check if a shape can respond to a specific trigger
   */
  public canShapeRespond(shape: IShape, trigger: {
    userId: string;
    channelId: string;
    isDM: boolean;
    content: string;
  }): boolean {
    const { userId, channelId, isDM, content } = trigger;

    // Check privacy settings
    const privacySettings = shape.settings?.privacySettings;
    if (privacySettings) {
      // Check ignored users
      if (privacySettings.ignoredUsers?.includes(userId)) {
        return false;
      }

      // Check ignored channels
      if (!isDM && privacySettings.ignoredChannels?.includes(channelId)) {
        return false;
      }

      // Check DM settings
      if (isDM) {
        const dmSettings = privacySettings.dmResponseSettings;
        if (!dmSettings?.enabled) {
          return false;
        }
        if (dmSettings.allowlist?.length && !dmSettings.allowlist.includes(userId)) {
          return false;
        }
        if (dmSettings.blocklist?.includes(userId)) {
          return false;
        }
      }
    }

    // Check free will settings
    const freeWill = shape.freeWill;
    if (freeWill) {
      // Check if shape responds to direct messages
      if (isDM && !freeWill.directMessages) {
        return false;
      }

      // Check keywords of interest
      const keywords = freeWill.keywordsOfInterest || [];
      if (keywords.length && !keywords.some(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      )) {
        return false;
      }
    }

    return true;
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    this.stopSync();
    this.removeAllListeners();
  }
}

export const shapeManager = ShapeManager.getInstance();
