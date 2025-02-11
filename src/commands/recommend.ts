import { SlashCommandBuilder } from 'discord.js';
import { fetchResponse, getAvailableModels } from '../integrations/openrouter';

export const data = new SlashCommandBuilder()
  .setName('recommend')
  .setDescription('Generates a recommendation.');

export const execute = async (interaction: any) => {
  const prompt = 'Generate a recommendation for a shape.';
  try {
    const models = await getAvailableModels();
    if (!models || models.length === 0) {
      await interaction.reply('No models available from OpenRouter.');
      return;
    }

    const model = models[0].id; // Select the first model
    const response = await fetchResponse(model, prompt);
    await interaction.reply(response);
  } catch (error: any) {
    console.error('Failed to generate recommendation:', error.message);
    await interaction.reply(`Failed to generate recommendation: ${error.message}`);
  }
};
