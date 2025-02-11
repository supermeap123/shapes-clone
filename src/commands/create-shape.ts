import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('create-shape')
  .setDescription('Creates a new shape.');

export const execute = async (interaction: any) => {
  const modal = new ModalBuilder()
    .setCustomId('createShapeModal')
    .setTitle('Create a New Shape');

  const backstoryInput = new TextInputBuilder()
    .setCustomId('backstoryInput')
    .setLabel("Shape's Backstory")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const toneInput = new TextInputBuilder()
    .setCustomId('toneInput')
    .setLabel("Shape's Tone")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const likesDislikesInput = new TextInputBuilder()
    .setCustomId('likesDislikesInput')
    .setLabel("Shape's Likes and Dislikes")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const firstActionRow = new ActionRowBuilder()
  .addComponents(backstoryInput as any);

  const secondActionRow = new ActionRowBuilder()
  .addComponents(toneInput as any);

  const thirdActionRow = new ActionRowBuilder()
  .addComponents(likesDislikesInput as any);

  modal.addComponents(firstActionRow as any, secondActionRow as any, thirdActionRow as any);

  await interaction.showModal(modal);
};
