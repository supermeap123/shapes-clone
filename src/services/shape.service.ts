import { Shape, IShape } from '../models/Shape';
import { CustomError } from '../middleware/errorHandler';
import { cloudinaryService } from './cloudinary.service';
import { UpdateProfileBody } from '../types/express';

export class ShapeService {
  private static instance: ShapeService;

  private constructor() {}

  public static getInstance(): ShapeService {
    if (!ShapeService.instance) {
      ShapeService.instance = new ShapeService();
    }
    return ShapeService.instance;
  }

  /**
   * Create a new shape
   */
  public async createShape(data: Partial<IShape>, ownerId: string): Promise<IShape> {
    const existingShape = await Shape.findOne({ vanityUrl: data.vanityUrl });
    if (existingShape) {
      throw new CustomError('Vanity URL already taken', 400);
    }

    const shape = new Shape({
      ...data,
      owners: [ownerId],
      isActive: true,
      version: 1,
    });

    await shape.save();
    return shape;
  }

  /**
   * Get shape by vanity URL
   */
  public async getShapeByVanityUrl(vanityUrl: string): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, isActive: true });
    if (!shape) {
      throw new CustomError('Shape not found', 404);
    }
    return shape;
  }

  /**
   * Get shapes owned by user
   */
  public async getShapesByOwner(ownerId: string): Promise<IShape[]> {
    return Shape.find({ owners: ownerId, isActive: true });
  }

  /**
   * Update shape profile
   */
  public async updateProfile(
    vanityUrl: string,
    ownerId: string,
    updates: UpdateProfileBody
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Update only provided fields
    Object.keys(updates).forEach((key) => {
      if (updates[key as keyof UpdateProfileBody] !== undefined) {
        shape[key as keyof IShape] = updates[key as keyof UpdateProfileBody];
      }
    });

    await shape.save();
    return shape;
  }

  /**
   * Update shape's vanity URL
   */
  public async updateVanityUrl(
    currentVanityUrl: string,
    newVanityUrl: string,
    ownerId: string
  ): Promise<IShape> {
    // Check if new vanity URL is available
    const existing = await Shape.findOne({ vanityUrl: newVanityUrl });
    if (existing) {
      throw new CustomError('Vanity URL already taken', 400);
    }

    const shape = await Shape.findOne({
      vanityUrl: currentVanityUrl,
      owners: ownerId,
    });

    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.vanityUrl = newVanityUrl;
    await shape.save();
    return shape;
  }

  /**
   * Update shape's avatar
   */
  public async updateAvatar(
    vanityUrl: string,
    ownerId: string,
    file: Express.Multer.File
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Upload new avatar
    const uploadResult = await cloudinaryService.uploadAvatar(file);

    // Delete old avatar if it exists
    if (shape.avatar) {
      try {
        const oldPublicId = cloudinaryService.getPublicIdFromUrl(shape.avatar);
        await cloudinaryService.deleteFile(oldPublicId);
      } catch (error) {
        console.error('Failed to delete old avatar:', error);
      }
    }

    shape.avatar = uploadResult.url;
    await shape.save();
    return shape;
  }

  /**
   * Update shape's banner
   */
  public async updateBanner(
    vanityUrl: string,
    ownerId: string,
    file: Express.Multer.File
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Upload new banner
    const uploadResult = await cloudinaryService.uploadBanner(file);

    // Delete old banner if it exists
    if (shape.banner) {
      try {
        const oldPublicId = cloudinaryService.getPublicIdFromUrl(shape.banner);
        await cloudinaryService.deleteFile(oldPublicId);
      } catch (error) {
        console.error('Failed to delete old banner:', error);
      }
    }

    shape.banner = uploadResult.url;
    await shape.save();
    return shape;
  }

  /**
   * Update personality settings
   */
  public async updatePersonality(
    vanityUrl: string,
    ownerId: string,
    updates: {
      nickname?: string;
      shortBackstory?: string;
      responseType?: string;
      personalityTraits?: string[];
      tone?: string;
      age?: number;
      history?: string;
      likes?: string;
      dislikes?: string;
      conversationalGoals?: string;
      conversationalExamples?: string;
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Update only provided fields
    Object.keys(updates).forEach((key) => {
      const value = updates[key as keyof typeof updates];
      if (value !== undefined) {
        shape[key as keyof IShape] = value as any;
      }
    });

    await shape.save();
    return shape;
  }

  /**
   * Update personality traits
   */
  public async updatePersonalityTraits(
    vanityUrl: string,
    ownerId: string,
    traits: string[]
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.personalityTraits = traits;
    await shape.save();
    return shape;
  }

  /**
   * Update free will settings
   */
  public async updateFreeWill(
    vanityUrl: string,
    ownerId: string,
    updates: {
      freeWillLevel?: 'strict' | 'semi-autonomous' | 'fully-autonomous';
      allowDirectMessages?: boolean;
      favoriteReactions?: string[];
      favoritePeople?: string[];
      keywordsOfInterest?: string[];
      serverInstructions?: string;
      dmInstructions?: string;
      aiModel?: string;
      temperature?: number;
      maxMessages?: number;
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Update only provided fields
    Object.keys(updates).forEach((key) => {
      const value = updates[key as keyof typeof updates];
      if (value !== undefined) {
        shape[key as keyof IShape] = value as any;
      }
    });

    await shape.save();
    return shape;
  }

  /**
   * Update favorite reactions
   */
  public async updateFavoriteReactions(
    vanityUrl: string,
    ownerId: string,
    reactions: string[]
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.favoriteReactions = reactions;
    await shape.save();
    return shape;
  }

  /**
   * Update keywords of interest
   */
  public async updateKeywordsOfInterest(
    vanityUrl: string,
    ownerId: string,
    keywords: string[]
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.keywordsOfInterest = keywords;
    await shape.save();
    return shape;
  }

  /**
   * Add general knowledge
   */
  public async addKnowledge(
    vanityUrl: string,
    ownerId: string,
    knowledge: { key: string; value: string }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Check if key already exists
    const existingIndex = shape.generalKnowledge.findIndex(k => k.key === knowledge.key);
    if (existingIndex >= 0) {
      // Update existing knowledge
      shape.generalKnowledge[existingIndex].value = knowledge.value;
    } else {
      // Add new knowledge
      shape.generalKnowledge.push(knowledge);
    }

    await shape.save();
    return shape;
  }

  /**
   * Delete general knowledge
   */
  public async deleteKnowledge(
    vanityUrl: string,
    ownerId: string,
    key: string
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.generalKnowledge = shape.generalKnowledge.filter(k => k.key !== key);
    await shape.save();
    return shape;
  }

  /**
   * Add command
   */
  public async addCommand(
    vanityUrl: string,
    ownerId: string,
    commandData: { command: string; response: string }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Check if command already exists
    const existingIndex = shape.commands.findIndex(c => c.command === commandData.command);
    if (existingIndex >= 0) {
      // Update existing command
      shape.commands[existingIndex].response = commandData.response;
    } else {
      // Add new command
      shape.commands.push(commandData);
    }

    await shape.save();
    return shape;
  }

  /**
   * Delete command
   */
  public async deleteCommand(
    vanityUrl: string,
    ownerId: string,
    command: string
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.commands = shape.commands.filter(c => c.command !== command);
    await shape.save();
    return shape;
  }

  /**
   * Add relationship
   */
  public async addRelationship(
    vanityUrl: string,
    ownerId: string,
    relationshipData: { userId: string; type: string; notes: string }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Check if relationship already exists
    const existingIndex = shape.relationships.findIndex(r => r.userId === relationshipData.userId);
    if (existingIndex >= 0) {
      // Update existing relationship
      shape.relationships[existingIndex] = relationshipData;
    } else {
      // Add new relationship
      shape.relationships.push(relationshipData);
    }

    await shape.save();
    return shape;
  }

  /**
   * Delete relationship
   */
  public async deleteRelationship(
    vanityUrl: string,
    ownerId: string,
    userId: string
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.relationships = shape.relationships.filter(r => r.userId !== userId);
    await shape.save();
    return shape;
  }

  /**
   * Add training snippet
   */
  public async addTrainingSnippet(
    vanityUrl: string,
    ownerId: string,
    snippet: {
      content: string;
      context: string;
      createdAt: Date;
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.conversationSnippets.push(snippet);
    await shape.save();
    return shape;
  }

  /**
   * Delete training snippet
   */
  public async deleteTrainingSnippet(
    vanityUrl: string,
    ownerId: string,
    snippetId: string
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Find the index of the snippet to delete
    const snippetIndex = shape.conversationSnippets.findIndex(
      (s) => s._id.toString() === snippetId
    );

    if (snippetIndex === -1) {
      throw new CustomError('Training snippet not found', 404);
    }

    // Remove the snippet
    shape.conversationSnippets.splice(snippetIndex, 1);
    await shape.save();
    return shape;
  }

  /**
   * Clear all training snippets
   */
  public async clearTrainingSnippets(
    vanityUrl: string,
    ownerId: string
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.conversationSnippets = [];
    await shape.save();
    return shape;
  }

  /**
   * Update AI engine settings
   */
  public async updateAIEngineSettings(
    vanityUrl: string,
    ownerId: string,
    updates: {
      primaryEngine?: string;
      fallbackEngine?: string;
      freeWillEngine?: string;
      languagePreset?: string;
      enginePreset?: string;
      advancedParams?: {
        temperature?: number;
        topP?: number;
        maxResponseLength?: number;
        contextWindow?: number;
      };
      memorySettings?: {
        enableShortTerm?: boolean;
        enableLongTerm?: boolean;
        enableGeneration?: boolean;
        enableRecall?: boolean;
        enableSharing?: boolean;
      };
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Update only provided fields
    Object.keys(updates).forEach((key) => {
      const value = updates[key as keyof typeof updates];
      if (value !== undefined) {
        if (key === 'advancedParams' || key === 'memorySettings') {
          shape[key] = { ...shape[key], ...value };
        } else {
          shape[key as keyof IShape] = value as any;
        }
      }
    });

    await shape.save();
    return shape;
  }

  /**
   * Update memory settings
   */
  public async updateMemorySettings(
    vanityUrl: string,
    ownerId: string,
    settings: {
      enableShortTerm: boolean;
      enableLongTerm: boolean;
      enableGeneration: boolean;
      enableRecall: boolean;
      enableSharing: boolean;
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.memorySettings = settings;
    await shape.save();
    return shape;
  }

  /**
   * Update advanced parameters
   */
  public async updateAdvancedParams(
    vanityUrl: string,
    ownerId: string,
    params: {
      temperature: number;
      topP: number;
      maxResponseLength: number;
      contextWindow: number;
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.advancedParams = params;
    await shape.save();
    return shape;
  }

  /**
   * Update image engine settings
   */
  public async updateImageEngineSettings(
    vanityUrl: string,
    ownerId: string,
    updates: {
      imageCommandPrefix?: string;
      imageEngine?: string;
      imagePreset?: string;
      imageSizeOptions?: {
        width?: number;
        height?: number;
        format?: string;
      };
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Update only provided fields
    Object.keys(updates).forEach((key) => {
      const value = updates[key as keyof typeof updates];
      if (value !== undefined) {
        if (key === 'imageSizeOptions') {
          shape[key] = { ...shape[key], ...value };
        } else {
          shape[key as keyof IShape] = value as any;
        }
      }
    });

    await shape.save();
    return shape;
  }

  /**
   * Update image size options
   */
  public async updateImageSizeOptions(
    vanityUrl: string,
    ownerId: string,
    options: {
      width: number;
      height: number;
      format: string;
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.imageSizeOptions = options;
    await shape.save();
    return shape;
  }

  /**
   * Update voice engine settings
   */
  public async updateVoiceEngineSettings(
    vanityUrl: string,
    ownerId: string,
    settings: {
      enableVoice: boolean;
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.enableVoice = settings.enableVoice;
    await shape.save();
    return shape;
  }

  /**
   * Update settings
   */
  public async updateSettings(
    vanityUrl: string,
    ownerId: string,
    updates: {
      owners?: string[];
      enabledCommands?: string[];
      privacy?: {
        isPublic?: boolean;
        allowDMs?: boolean;
        ignoredUsers?: string[];
        ignoredChannels?: string[];
      };
      customMessages?: {
        wack?: string;
        error?: string;
        sleep?: string;
        serverJoin?: string;
      };
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Update only provided fields
    Object.keys(updates).forEach((key) => {
      const value = updates[key as keyof typeof updates];
      if (value !== undefined) {
        if (key === 'privacy' || key === 'customMessages') {
          shape[key] = { ...shape[key], ...value };
        } else {
          shape[key as keyof IShape] = value as any;
        }
      }
    });

    await shape.save();
    return shape;
  }

  /**
   * Update privacy settings
   */
  public async updatePrivacySettings(
    vanityUrl: string,
    ownerId: string,
    settings: {
      isPublic: boolean;
      allowDMs: boolean;
      ignoredUsers: string[];
      ignoredChannels: string[];
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.privacy = settings;
    await shape.save();
    return shape;
  }

  /**
   * Update custom messages
   */
  public async updateCustomMessages(
    vanityUrl: string,
    ownerId: string,
    messages: {
      wack: string;
      error: string;
      sleep: string;
      serverJoin: string;
    }
  ): Promise<IShape> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    shape.customMessages = messages;
    await shape.save();
    return shape;
  }

  /**
   * Delete shape
   */
  public async deleteShape(vanityUrl: string, ownerId: string): Promise<void> {
    const shape = await Shape.findOne({ vanityUrl, owners: ownerId });
    if (!shape) {
      throw new CustomError('Shape not found or unauthorized', 404);
    }

    // Delete associated files
    if (shape.avatar) {
      try {
        const avatarPublicId = cloudinaryService.getPublicIdFromUrl(shape.avatar);
        await cloudinaryService.deleteFile(avatarPublicId);
      } catch (error) {
        console.error('Failed to delete avatar:', error);
      }
    }

    if (shape.banner) {
      try {
        const bannerPublicId = cloudinaryService.getPublicIdFromUrl(shape.banner);
        await cloudinaryService.deleteFile(bannerPublicId);
      } catch (error) {
        console.error('Failed to delete banner:', error);
      }
    }

    // Soft delete the shape
    shape.isActive = false;
    await shape.save();
  }
}

// Export singleton instance
export const shapeService = ShapeService.getInstance();
