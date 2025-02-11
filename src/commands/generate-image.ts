import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const data = new SlashCommandBuilder()
  .setName('generate-image')
  .setDescription('Generates an image from a prompt.')
  .addStringOption(option =>
    option.setName('prompt')
      .setDescription('The prompt to generate the image from.')
      .setRequired(true)
  );

export const execute = async (interaction: any) => {
  const prompt = interaction.options.getString('prompt');

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });
    const image_url = response.data.data[0].url;
    const attachment = new AttachmentBuilder(image_url, { name: 'image.png' });
    await interaction.reply({ files: [attachment] });
  } catch (error: any) {
    console.error(error);
    await interaction.reply(`There was an error generating the image: ${error.message}`);
  }
};
