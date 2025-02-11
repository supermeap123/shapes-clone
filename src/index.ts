import { Client, CommandInteraction, GatewayIntentBits, IntentsBitField } from 'discord.js';
import * as dotenv from 'dotenv';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as ping from './commands/ping';
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

const commands = [
  ping.data.toJSON(),
];

client.on('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(client.user?.id as string, process.env.GUILD_ID as string),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === ping.data.name) {
    await ping.execute(interaction as CommandInteraction);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  console.log(`Received message: ${message.content}`);
});

client.login(process.env.DISCORD_TOKEN);
