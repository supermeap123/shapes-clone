import { GatewayIntentBits } from 'discord.js';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';
import { REST, Routes } from 'discord.js';
import { ExtendedClient } from './utils/ExtendedClient';

// Load environment variables from .env file
config();

// Create a new Discord client
const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Load command handlers
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// Event handler for when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

// Event handler for interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  console.log(`Received command: ${interaction.commandName}`);
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    console.warn(`Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
  }
});

// Register commands for the guild during development
const GUILD_ID = '1311157466935070790'; // Replace with your Discord server's guild ID
client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);
  try {
    console.log('Started refreshing application (/) commands.');

    if (!client.user?.id) {
      console.error('Client user ID is undefined.');
      return;
    }

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, GUILD_ID),
      { body: Array.from(client.commands.values()).map(cmd => cmd.data.toJSON()) },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

// Log in to Discord
console.log('Discord Bot Token:', process.env.DISCORD_BOT_TOKEN);
client.login(process.env.DISCORD_BOT_TOKEN);
