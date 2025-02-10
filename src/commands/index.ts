import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, Interaction } from 'discord.js';

// General Commands
export const generalCommands = [
  new SlashCommandBuilder()
    .setName('activate')
    .setDescription('Activate the bot'),
  new SlashCommandBuilder()
    .setName('deactivate')
    .setDescription('Deactivate the bot'),
  new SlashCommandBuilder()
    .setName('configure')
    .setDescription('Configure bot settings'),
  new SlashCommandBuilder()
    .setName('create-shape')
    .setDescription('Create a new shape'),
  new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Access the bot dashboard'),
  new SlashCommandBuilder()
    .setName('debug')
    .setDescription('Initiate a debugging session'),
  new SlashCommandBuilder()
    .setName('generate-image')
    .setDescription('Generate an image'),
  new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Retrieve the bot invite link'),
  new SlashCommandBuilder()
    .setName('recommend-shape')
    .setDescription('Recommend a shape'),
  new SlashCommandBuilder()
    .setName('reset-memories')
    .setDescription('Reset bot memories'),
  new SlashCommandBuilder()
    .setName('search-shapes')
    .setDescription('Search for new shapes'),
  new SlashCommandBuilder()
    .setName('simulate-sleep')
    .setDescription('Simulate sleep for memory updates'),
  new SlashCommandBuilder()
    .setName('clear-memory-buffer')
    .setDescription('Clear the recent memory buffer'),
  new SlashCommandBuilder()
    .setName('chat-revive')
    .setDescription('Trigger a chat revive action'),
].map(command => command.toJSON());

// Moderation Commands
export const moderationCommands = [
  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user'),
  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user'),
  new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user'),
  new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a user'),
  new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user'),
  new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge messages'),
  new SlashCommandBuilder()
    .setName('add-role')
    .setDescription('Add a role to a user'),
  new SlashCommandBuilder()
    .setName('remove-role')
    .setDescription('Remove a role from a user'),
  new SlashCommandBuilder()
    .setName('set-slowmode')
    .setDescription('Set slow mode for a channel'),
  new SlashCommandBuilder()
    .setName('lock-channel')
    .setDescription('Lock a channel'),
  new SlashCommandBuilder()
    .setName('unlock-channel')
    .setDescription('Unlock a channel'),
  new SlashCommandBuilder()
    .setName('mark-nsfw')
    .setDescription('Mark a channel as NSFW'),
  new SlashCommandBuilder()
    .setName('unmark-nsfw')
    .setDescription('Unmark a channel as NSFW'),
  new SlashCommandBuilder()
    .setName('send-message')
    .setDescription('Send a message on behalf of the bot'),
  new SlashCommandBuilder()
    .setName('get-user-info')
    .setDescription('Retrieve user information'),
  new SlashCommandBuilder()
    .setName('get-server-info')
    .setDescription('Retrieve server information'),
].map(command => command.toJSON());

export async function registerCommands(clientId: string, token: string) {
  const rest = new REST({ version: '10' }).setToken(token);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: [...generalCommands, ...moderationCommands] },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

export async function handleInteraction(interaction: Interaction) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  // General Command Handlers
  if (commandName === 'activate') {
    await interaction.reply('Bot activated!');
  } else if (commandName === 'deactivate') {
    await interaction.reply('Bot deactivated!');
  } else if (commandName === 'configure') {
    await interaction.reply('Bot settings configured!');
  } else if (commandName === 'create-shape') {
    await interaction.reply('New shape created!');
  } else if (commandName === 'dashboard') {
    await interaction.reply('Accessing dashboard...');
  } else if (commandName === 'debug') {
    await interaction.reply('Debugging session initiated!');
  } else if (commandName === 'generate-image') {
    await interaction.reply('Image generated!');
  } else if (commandName === 'invite') {
    await interaction.reply('Invite link retrieved!');
  } else if (commandName === 'recommend-shape') {
    await interaction.reply('Shape recommended!');
  } else if (commandName === 'reset-memories') {
    await interaction.reply('Memories reset!');
  } else if (commandName === 'search-shapes') {
    await interaction.reply('Searching for new shapes...');
  } else if (commandName === 'simulate-sleep') {
    await interaction.reply('Simulating sleep...');
  } else if (commandName === 'clear-memory-buffer') {
    await interaction.reply('Memory buffer cleared!');
  } else if (commandName === 'chat-revive') {
    await interaction.reply('Chat revived!');
  }

  // Moderation Command Handlers
  if (commandName === 'kick') {
    await interaction.reply('User kicked!');
  } else if (commandName === 'ban') {
    await interaction.reply('User banned!');
  } else if (commandName === 'mute') {
    await interaction.reply('User muted!');
  } else if (commandName === 'unmute') {
    await interaction.reply('User unmuted!');
  } else if (commandName === 'warn') {
    await interaction.reply('User warned!');
  } else if (commandName === 'purge') {
    await interaction.reply('Messages purged!');
  } else if (commandName === 'add-role') {
    await interaction.reply('Role added!');
  } else if (commandName === 'remove-role') {
    await interaction.reply('Role removed!');
  } else if (commandName === 'set-slowmode') {
    await interaction.reply('Slow mode set!');
  } else if (commandName === 'lock-channel') {
    await interaction.reply('Channel locked!');
  } else if (commandName === 'unlock-channel') {
    await interaction.reply('Channel unlocked!');
  } else if (commandName === 'mark-nsfw') {
    await interaction.reply('Channel marked as NSFW!');
  } else if (commandName === 'unmark-nsfw') {
    await interaction.reply('Channel unmarked as NSFW!');
  } else if (commandName === 'send-message') {
    await interaction.reply('Message sent!');
  } else if (commandName === 'get-user-info') {
    await interaction.reply('User information retrieved!');
  } else if (commandName === 'get-server-info') {
    await interaction.reply('Server information retrieved!');
  }
}
