import { IShape } from '../types/shape';
import config from '../config/config';

interface Memory {
  content: string;
  timestamp: Date;
  type: 'short_term' | 'long_term';
  metadata?: {
    userId?: string;
    channelId?: string;
    importance?: number;
    sentiment?: string;
    topics?: string[];
  };
}

interface MemoryContext {
  relevantMemories: Memory[];
  contextString: string;
}

class MemoryService {
  private static instance: MemoryService;
  private memories: Map<string, Memory[]> = new Map(); // Key: shapeId

  private constructor() {}

  public static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }

  /**
   * Add a new memory for a shape
   */
  public async addMemory(
    shape: IShape,
    content: string,
    type: 'short_term' | 'long_term' = 'short_term',
    metadata: Memory['metadata'] = {}
  ): Promise<void> {
    const shapeId = shape._id.toString();
    const shapeMemories = this.memories.get(shapeId) || [];

    // Create new memory
    const memory: Memory = {
      content,
      timestamp: new Date(),
      type,
      metadata,
    };

    // Add memory to collection
    shapeMemories.push(memory);

    // Enforce memory limits
    this.enforceMemoryLimits(shape, shapeMemories);

    // Update memories map
    this.memories.set(shapeId, shapeMemories);
  }

  /**
   * Get relevant memories for a given context
   */
  public async getRelevantMemories(
    shape: IShape,
    context: string,
    options: {
      maxMemories?: number;
      includeShortTerm?: boolean;
      includeLongTerm?: boolean;
      userId?: string;
      channelId?: string;
    } = {}
  ): Promise<MemoryContext> {
    const {
      maxMemories = 5,
      includeShortTerm = true,
      includeLongTerm = true,
      userId,
      channelId,
    } = options;

    const shapeId = shape._id.toString();
    const shapeMemories = this.memories.get(shapeId) || [];

    // Filter memories based on type and metadata
    let filteredMemories = shapeMemories.filter(memory => {
      // Check memory type
      if (!includeShortTerm && memory.type === 'short_term') return false;
      if (!includeLongTerm && memory.type === 'long_term') return false;

      // Check user/channel filters
      if (userId && memory.metadata?.userId !== userId) return false;
      if (channelId && memory.metadata?.channelId !== channelId) return false;

      return true;
    });

    // Sort memories by relevance and recency
    filteredMemories = this.rankMemoriesByRelevance(filteredMemories, context);

    // Take top N memories
    const relevantMemories = filteredMemories.slice(0, maxMemories);

    // Build context string
    const contextString = this.buildMemoryContext(relevantMemories);

    return {
      relevantMemories,
      contextString,
    };
  }

  /**
   * Clean up old memories
   */
  public async cleanupMemories(shape: IShape): Promise<void> {
    const shapeId = shape._id.toString();
    const shapeMemories = this.memories.get(shapeId) || [];

    const now = new Date();
    const retentionDays = config.memory.retentionDays;

    // Filter out old memories
    const filteredMemories = shapeMemories.filter(memory => {
      const ageInDays = (now.getTime() - memory.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return ageInDays <= retentionDays;
    });

    this.memories.set(shapeId, filteredMemories);
  }

  /**
   * Convert short-term memory to long-term memory
   */
  public async convertToLongTerm(
    shape: IShape,
    memoryContent: string
  ): Promise<void> {
    const shapeId = shape._id.toString();
    const shapeMemories = this.memories.get(shapeId) || [];

    // Find the memory
    const memoryIndex = shapeMemories.findIndex(
      m => m.content === memoryContent && m.type === 'short_term'
    );

    if (memoryIndex !== -1) {
      // Convert to long-term
      shapeMemories[memoryIndex].type = 'long_term';
      this.memories.set(shapeId, shapeMemories);
    }
  }

  /**
   * Clear all memories for a shape
   */
  public async clearMemories(shape: IShape, type?: 'short_term' | 'long_term'): Promise<void> {
    const shapeId = shape._id.toString();
    const shapeMemories = this.memories.get(shapeId) || [];

    if (type) {
      // Clear only specified type
      const filteredMemories = shapeMemories.filter(m => m.type !== type);
      this.memories.set(shapeId, filteredMemories);
    } else {
      // Clear all memories
      this.memories.delete(shapeId);
    }
  }

  /**
   * Enforce memory limits based on shape settings
   */
  private enforceMemoryLimits(shape: IShape, memories: Memory[]): void {
    const shortTermLimit = config.memory.shortTermLimit;
    const longTermLimit = config.memory.longTermLimit;

    // Split memories by type
    const shortTermMemories = memories.filter(m => m.type === 'short_term');
    const longTermMemories = memories.filter(m => m.type === 'long_term');

    // Enforce limits
    if (shortTermMemories.length > shortTermLimit) {
      // Remove oldest short-term memories
      const excess = shortTermMemories.length - shortTermLimit;
      memories = memories.filter(m => {
        if (m.type !== 'short_term') return true;
        const index = shortTermMemories.indexOf(m);
        return index >= excess;
      });
    }

    if (longTermMemories.length > longTermLimit) {
      // Remove oldest long-term memories
      const excess = longTermMemories.length - longTermLimit;
      memories = memories.filter(m => {
        if (m.type !== 'long_term') return true;
        const index = longTermMemories.indexOf(m);
        return index >= excess;
      });
    }
  }

  /**
   * Rank memories by relevance to context
   */
  private rankMemoriesByRelevance(memories: Memory[], context: string): Memory[] {
    return memories.sort((a, b) => {
      // Calculate relevance scores
      const scoreA = this.calculateRelevanceScore(a, context);
      const scoreB = this.calculateRelevanceScore(b, context);

      // Sort by score (descending) and then by timestamp (most recent first)
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }

  /**
   * Calculate relevance score for a memory
   */
  private calculateRelevanceScore(memory: Memory, context: string): number {
    let score = 0;

    // Base score from importance
    score += (memory.metadata?.importance || 0) * 2;

    // Recency bonus (0-1)
    const ageInHours = (Date.now() - memory.timestamp.getTime()) / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 1 - (ageInHours / (24 * config.memory.retentionDays)));
    score += recencyScore;

    // Content relevance (simple word matching)
    const contextWords = context.toLowerCase().split(/\s+/);
    const memoryWords = memory.content.toLowerCase().split(/\s+/);
    const matchingWords = contextWords.filter(word => memoryWords.includes(word));
    score += matchingWords.length * 0.5;

    // Topic matching
    if (memory.metadata?.topics) {
      const topicMatches = memory.metadata.topics.filter(topic =>
        context.toLowerCase().includes(topic.toLowerCase())
      );
      score += topicMatches.length;
    }

    return score;
  }

  /**
   * Build context string from memories
   */
  private buildMemoryContext(memories: Memory[]): string {
    if (!memories.length) return '';

    const contextParts = memories.map(memory => {
      const timeAgo = this.getTimeAgoString(memory.timestamp);
      return `${timeAgo}: ${memory.content}`;
    });

    return `Previous interactions:\n${contextParts.join('\n')}`;
  }

  /**
   * Get human-readable time ago string
   */
  private getTimeAgoString(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    if (diffMins > 0) return `${diffMins} minutes ago`;
    return 'Just now';
  }
}

export const memoryService = MemoryService.getInstance();
