import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const openRouterClient = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  },
});

export async function fetchResponse(model: string, prompt: string) {
  try {
    const response = await openRouterClient.post('/completions', {
      model: model,
      prompt: prompt,
      max_tokens: 200,
    });

    return response.data.choices[0].text;
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.message);
    throw new Error(`Failed to fetch response from OpenRouter: ${error.message}`);
  }
}

export async function getAvailableModels() {
  try {
    const response = await openRouterClient.get('/models');
    return response.data.data;
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.message);
    throw new Error(`Failed to fetch available models from OpenRouter: ${error.message}`);
  }
}
