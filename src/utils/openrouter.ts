import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface OpenRouterModel {
  id: string;
}

interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

interface OpenRouterCompletionResponse {
  choices: { message: { content: string } }[];
}

async function getAvailableOpenRouterModels(): Promise<string[]> {
  try {
    const response = await axios.get<OpenRouterModelsResponse>('https://openrouter.ai/api/v1/models', {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
    });
    return response.data.data.map((model: OpenRouterModel) => model.id);
  } catch (error: any) {
    console.error('Error fetching OpenRouter models:', error.message);
    return [];
  }
}

export async function getOpenRouterCompletion(prompt: string, model?: string) {
  try {
    const availableModels = await getAvailableOpenRouterModels();
    const selectedModel = model && availableModels.includes(model) ? model : 'openai/gpt-3.5-turbo';

    const response = await axios.post<OpenRouterCompletionResponse>(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error calling OpenRouter API:', error.message);
    return null;
  }
}
