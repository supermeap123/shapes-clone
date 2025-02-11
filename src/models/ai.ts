export interface AIModelConfig {
  name: string;
  provider: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export const defaultAIModelConfig: AIModelConfig = {
  name: 'Default',
  provider: 'OpenAI',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 200,
};
