import type { GuildSettings, CommandSettings } from '../../services/settings';
import type { PersonalityConfig } from '../../discord/types';

export function createMockPersonality(overrides: Partial<PersonalityConfig> = {}): PersonalityConfig {
  return {
    backstory: 'Test backstory',
    traits: ['helpful', 'friendly'],
    tone: 'casual',
    likes: ['helping', 'learning'],
    dislikes: ['rudeness', 'spam'],
    conversationStyle: 'adaptive',
    ...overrides
  };
}

export function createMockMemory(overrides: Partial<GuildSettings['memory']> = {}): GuildSettings['memory'] {
  return {
    retention: 100,
    revivalThreshold: 30,
    timeAware: true,
    ...overrides
  };
}

export function createMockCommands(overrides: Partial<CommandSettings>[] = []): CommandSettings[] {
  const defaultCommands: CommandSettings[] = [
    { name: 'help', enabled: true },
    { name: 'ping', enabled: true },
    { name: 'invite', enabled: true }
  ];

  return defaultCommands.map((cmd, index) => ({
    ...cmd,
    ...(overrides[index] || {})
  }));
}

export function createMockSettings(
  guildId: string,
  overrides: Partial<GuildSettings> = {}
): GuildSettings {
  return {
    guildId,
    botToken: 'mock-token',
    openrouterKey: 'mock-key',
    enableDMs: false,
    showServerList: false,
    personality: createMockPersonality(overrides.personality),
    memory: createMockMemory(overrides.memory),
    commands: createMockCommands(overrides.commands as Partial<CommandSettings>[] || []),
    errorMessages: {
      default: 'An error occurred',
      permissionDenied: 'Permission denied',
      cooldown: 'Please wait',
      ...overrides.errorMessages
    },
    welcomeMessage: 'Welcome to the server!',
    memoryUpdateMessage: 'Updating memory...',
    serverJoinMessage: 'Thanks for adding me!',
    ...overrides
  };
}

export function createMockSettingsUpdate(
  overrides: Partial<GuildSettings> = {}
): Partial<GuildSettings> {
  return {
    personality: createMockPersonality(overrides.personality),
    memory: createMockMemory(overrides.memory),
    ...overrides
  };
}

export function createInvalidSettings(): Array<Partial<GuildSettings>> {
  return [
    { guildId: '' }, // Empty guild ID
    { personality: null as any }, // Missing personality
    { memory: null as any }, // Missing memory
    { commands: 'not-an-array' as any }, // Invalid commands type
    {
      personality: {
        backstory: '',
        traits: null as any,
        tone: null as any,
        likes: null as any,
        dislikes: null as any,
        conversationStyle: null as any
      }
    },
    {
      memory: {
        retention: -1,
        revivalThreshold: 'not-a-number' as any,
        timeAware: 'not-a-boolean' as any
      }
    }
  ];
}
