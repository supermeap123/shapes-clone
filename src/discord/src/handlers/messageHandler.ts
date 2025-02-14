import { Message } from 'discord.js';
import { shapeManager } from '../services/ShapeManager';
import { aiService } from '../services/AIService';
import { memoryService } from '../services/MemoryService';
import { IShape } from '../types/shape';

export class MessageHandler {
  /**
   * Handle incoming messages
   */
  public static async handleMessage(message: Message): Promise<void> {
    try {
      // Ignore bot messages
      if (message.author.bot) return;

      // Get relevant shapes for this message
      const shapes = this.getRelevantShapes(message);
      if (!shapes.length) return;

      // Process message for each relevant shape
      await Promise.all(shapes.map(shape => this.processShapeResponse(shape, message)));
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  /**
   * Get shapes that should respond to this message
   */
  private static getRelevantShapes(message: Message) {
    const isDM = !message.guild;
    const shapes = isDM
      ? shapeManager.getShapesForDM()
      : shapeManager.getShapesForChannel(message.channelId);

    // Filter shapes based on message context
    return shapes.filter(shape =>
      shapeManager.canShapeRespond(shape, {
        userId: message.author.id,
        channelId: message.channelId,
        isDM,
        content: message.content,
      })
    );
  }

  /**
   * Process and generate a response for a specific shape
   */
  private static async processShapeResponse(shape: IShape, message: Message) {
    try {
      // Get relevant memories
      const memories = await memoryService.getRelevantMemories(shape, message.content, {
        userId: message.author.id,
        channelId: message.channelId,
        maxMemories: 5,
      });

      // Generate AI response
      const response = await aiService.generateResponse(
        shape,
        message.content,
        [memories.contextString],
        {
          temperature: shape.freeWill?.temperature,
          maxTokens: shape.aiEngine?.maxResponseLength,
        }
      );

      // Store the interaction in memory
      await this.storeInteractionMemory(shape, message, response.text);

      // Send the response
      await this.sendResponse(message, response.text);

      // Handle reactions if enabled
      if (shape.freeWill?.reactions?.enabled) {
        await this.handleReactions(message, shape);
      }
    } catch (error) {
      console.error(`Error processing response for shape ${shape._id}:`, error);
      
      // Send error message if configured
      const errorMessage = shape.settings?.customMessages?.errorMessage;
      if (errorMessage) {
        await message.reply(errorMessage);
      }
    }
  }

  /**
   * Store interaction in shape's memory
   */
  private static async storeInteractionMemory(
    shape: IShape,
    message: Message,
    response: string
  ) {
    // Store user's message
    await memoryService.addMemory(
      shape,
      `User ${message.author.username} said: ${message.content}`,
      'short_term',
      {
        userId: message.author.id,
        channelId: message.channelId,
      }
    );

    // Store shape's response
    await memoryService.addMemory(
      shape,
      `I responded: ${response}`,
      'short_term',
      {
        userId: message.author.id,
        channelId: message.channelId,
      }
    );
  }

  /**
   * Send response message
   */
  private static async sendResponse(message: Message, content: string) {
    try {
      // Split long messages if needed
      const chunks = this.splitMessage(content);
      for (const chunk of chunks) {
        await message.reply(chunk);
      }
    } catch (error) {
      console.error('Error sending response:', error);
      throw error;
    }
  }

  /**
   * Handle reactions to messages
   */
  private static async handleReactions(message: Message, shape: IShape) {
    try {
      const reactions = shape.freeWill?.reactions?.favorites || [];
      if (reactions.length) {
        // Randomly select a reaction
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        await message.react(reaction);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }

  /**
   * Split message into chunks if too long
   */
  private static splitMessage(content: string, maxLength = 2000): string[] {
    if (content.length <= maxLength) return [content];

    const chunks: string[] = [];
    let remaining = content;

    while (remaining.length > 0) {
      let chunk: string;
      if (remaining.length <= maxLength) {
        chunk = remaining;
        remaining = '';
      } else {
        // Find last space within maxLength
        const lastSpace = remaining.lastIndexOf(' ', maxLength);
        const splitIndex = lastSpace > 0 ? lastSpace : maxLength;
        chunk = remaining.slice(0, splitIndex);
        remaining = remaining.slice(splitIndex + 1);
      }
      chunks.push(chunk);
    }

    return chunks;
  }
}
