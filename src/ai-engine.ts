import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: 'https://openrouter.ai/api',
});

export async function initializeAIEngine() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  }
});
const models = await response.json();
    console.log('AI Engine initialized successfully with models:', models.data);
  } catch (error) {
    console.error('Failed to initialize AI Engine:', error);
  }
}
