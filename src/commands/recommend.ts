import { SlashCommandBuilder } from 'discord.js';
import { fetchResponse, getAvailableModels, OpenRouterModel } from '../integrations/openrouter';
import { ExtendedClient } from '../utils/ExtendedClient';
import MemoryManager from '../memory/memoryManager';
import { pinecone, index } from '../integrations/pinecone';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const data = new SlashCommandBuilder()
  .setName('recommend')
  .setDescription('Generates a recommendation.');

export const execute = async (interaction: any) => {
  const client = interaction.client as ExtendedClient;
  const userId = interaction.user.id;
  let prompt = 'Generate a recommendation.';

  if (client.shapes && client.shapes.length > 0) {
    const shape = client.shapes[client.shapes.length - 1];
    prompt = `Generate a recommendation based on the following shape: ${JSON.stringify(shape)}.`;
  }

  try {
    const models = await getAvailableModels();
    if (!models || models.length === 0) {
      await interaction.reply('No models available from OpenRouter.');
      return;
    }

    const model: OpenRouterModel = models[0]; // Select the first model
    const memoryManager = new MemoryManager(model.context_length);

    const recentMessages = memoryManager.getRecentMessages(userId);

    // Generate embedding for the prompt
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: prompt,
      encoding_format: "float",
    });

    const embedding = embeddingResponse.data[0].embedding;

    const pineconeResults = await index.query({
      topK: 5,
      vector: embedding,
      includeValues: true,
      includeMetadata: true,
    });

    const context = `Recent messages: ${recentMessages.join('\n')}\nRelevant past responses from Pinecone: ${JSON.stringify(pineconeResults)}`;
    const enrichedPrompt = `${prompt}\n${context}`;

    const response = await fetchResponse(model.id, enrichedPrompt);

    memoryManager.storeMessage(userId, `You: ${prompt}\nBot: ${response}`);
    await interaction.reply(response);
  } catch (error: any) {
    console.error('Failed to generate recommendation:', error.message);
    await interaction.reply(`Failed to generate recommendation: ${error.message}`);
  }
};
