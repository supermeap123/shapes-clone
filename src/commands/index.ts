import { REST, Routes } from 'discord.js';
import { data as activateData } from './general/activate';

const commands = [
  activateData.toJSON(),
  // Add more commands here
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

export async function registerCommands() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}
