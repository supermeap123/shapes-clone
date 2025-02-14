import axios from 'axios';
import config from '../config/config';
import { IShape } from '../types/shape';

interface AIResponse {
  text: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

class AIService {
  private static instance: AIService;
  private readonly defaultModel = 'openai/gpt-3.5-turbo';
  private readonly maxContextTokens = 4096;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Generate a response using the appropriate AI model
   */
  public async generateResponse(
    shape: IShape,
    prompt: string,
    context: string[] = [],
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    try {
      const model = this.selectModel(shape);
      const messages = this.buildMessages(shape, prompt, context);
      const requestOptions = this.buildRequestOptions(shape, options);

      const response = await axios.post(
        `${config.openRouter.apiUrl}/chat/completions`,
        {
          model,
          messages,
          ...requestOptions,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.openRouter.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        text: response.data.choices[0].message.content,
        model: response.data.model,
        usage: {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
        },
      };
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  /**
   * Select the appropriate model based on shape settings
   */
  private selectModel(shape: IShape): string {
    const aiEngine = shape.aiEngine;
    if (!aiEngine) return this.defaultModel;

    // Try primary engine
    if (aiEngine.primaryEngine) {
      return aiEngine.primaryEngine;
    }

    // Fallback to default
    return this.defaultModel;
  }

  /**
   * Build the messages array for the AI request
   */
  private buildMessages(shape: IShape, prompt: string, context: string[]): any[] {
    const messages: any[] = [];

    // Add system message with shape personality and instructions
    const systemMessage = this.buildSystemMessage(shape);
    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage,
      });
    }

    // Add context messages
    for (const contextMessage of context) {
      messages.push({
        role: 'assistant',
        content: contextMessage,
      });
    }

    // Add user prompt
    messages.push({
      role: 'user',
      content: prompt,
    });

    return messages;
  }

  /**
   * Build the system message from shape settings
   */
  private buildSystemMessage(shape: IShape): string {
    const parts: string[] = [];

    // Add personality traits
    if (shape.personality) {
      const {
        nickname,
        shortBackstory,
        personalityTraits,
        tone,
        likes,
        dislikes,
        conversationalGoals,
      } = shape.personality;

      if (nickname) parts.push(`Your name is ${nickname}.`);
      if (shortBackstory) parts.push(`Background: ${shortBackstory}`);
      if (personalityTraits?.length) {
        parts.push(`Your personality traits: ${personalityTraits.join(', ')}`);
      }
      if (tone) parts.push(`You speak in a ${tone} tone.`);
      if (likes) parts.push(`Things you like: ${likes}`);
      if (dislikes) parts.push(`Things you dislike: ${dislikes}`);
      if (conversationalGoals) parts.push(`Your goals: ${conversationalGoals}`);
    }

    // Add knowledge base
    if (shape.knowledge?.generalKnowledge?.length) {
      parts.push('Important knowledge:');
      parts.push(...shape.knowledge.generalKnowledge);
    }

    // Add free will instructions
    if (shape.freeWill) {
      const { serverInstructions, dmInstructions } = shape.freeWill;
      if (serverInstructions) parts.push(`Server behavior: ${serverInstructions}`);
      if (dmInstructions) parts.push(`DM behavior: ${dmInstructions}`);
    }

    return parts.join('\n\n');
  }

  /**
   * Build request options based on shape settings and overrides
   */
  private buildRequestOptions(shape: IShape, options: AIRequestOptions): AIRequestOptions {
    const aiEngine = shape.aiEngine;
    const freeWill = shape.freeWill;

    return {
      temperature: options.temperature ?? freeWill?.temperature ?? aiEngine?.temperature ?? 0.7,
      maxTokens: options.maxTokens ?? aiEngine?.maxResponseLength ?? 150,
      topP: options.topP ?? aiEngine?.topP ?? 1,
      frequencyPenalty: options.frequencyPenalty ?? 0,
      presencePenalty: options.presencePenalty ?? 0,
    };
  }

  /**
   * Estimate token count for a string
   * This is a rough estimate - actual tokens may vary
   */
  private estimateTokenCount(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}

export const aiService = AIService.getInstance();
