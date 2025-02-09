import { 
  Interaction, 
  ChatInputCommandInteraction, 
  AutocompleteInteraction,
  PermissionsBitField
} from 'discord.js';
import { logger } from '../../utils/logger';

// Cooldown management
const cooldowns = new Map<string, Map<string, number>>();

export async function handleInteraction(interaction: Interaction): Promise<void> {
  try {
    if (interaction.isChatInputCommand()) {
      await handleCommand(interaction);
    } else if (interaction.isAutocomplete()) {
      await handleAutocomplete(interaction);
    }
  } catch (error) {
    logger.error('Error handling interaction:', error);
    
    // Handle failed responses
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'There was an error while executing this command.',
        ephemeral: true
      });
    }
  }
}

async function handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`Command not found: ${interaction.commandName}`);
    await interaction.reply({
      content: 'This command is not currently available.',
      ephemeral: true
    });
    return;
  }

  // Check permissions
  if (command.permissions && interaction.memberPermissions) {
    const missingPermissions = command.permissions.filter(
      permission => !interaction.memberPermissions?.has(permission)
    );

    if (missingPermissions.length > 0) {
      await interaction.reply({
        content: `You need the following permissions to use this command: ${missingPermissions.join(', ')}`,
        ephemeral: true
      });
      return;
    }
  }

  // Handle cooldowns
  if (command.cooldown) {
    const now = Date.now();
    const commandCooldowns = cooldowns.get(interaction.commandName) ?? new Map();
    const cooldownAmount = command.cooldown * 1000;
    const userCooldown = commandCooldowns.get(interaction.user.id);

    if (userCooldown) {
      const timeLeft = userCooldown - now;
      if (timeLeft > 0) {
        await interaction.reply({
          content: `Please wait ${(timeLeft / 1000).toFixed(1)} more seconds before using this command again.`,
          ephemeral: true
        });
        return;
      }
    }

    commandCooldowns.set(interaction.user.id, now + cooldownAmount);
    cooldowns.set(interaction.commandName, commandCooldowns);

    // Clean up expired cooldowns
    setTimeout(() => {
      commandCooldowns.delete(interaction.user.id);
      if (commandCooldowns.size === 0) {
        cooldowns.delete(interaction.commandName);
      }
    }, cooldownAmount);
  }

  // Execute command
  await command.execute(interaction);
}

async function handleAutocomplete(interaction: AutocompleteInteraction): Promise<void> {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command?.autocomplete) {
    logger.warn(`Autocomplete not implemented for command: ${interaction.commandName}`);
    return;
  }

  await command.autocomplete(interaction);
}
