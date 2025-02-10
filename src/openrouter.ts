import axios from 'axios';

export class OpenRouterClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendRequest(prompt: string): Promise<any> {
    const response = await axios.post(
      'https://api.openrouter.ai/v1/chat/completions',
      {
        model: 'openai/gpt-4',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }
}

export const openRouterClient = new OpenRouterClient(process.env.OPENROUTER_API_KEY!);
