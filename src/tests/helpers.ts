import type { ChatInputCommandInteraction } from 'discord.js';

/**
 * Creates a mock interaction for testing Discord commands
 * @param overrides Optional properties to override default mock values
 * @returns A mock interaction that can be used in tests
 */
export function createMockInteraction(overrides: Partial<MockInteraction> = {}): ChatInputCommandInteraction {
  const defaultMock: MockInteraction = {
    reply: jest.fn().mockResolvedValue({ createdTimestamp: Date.now() }),
    editReply: jest.fn().mockResolvedValue(undefined),
    followUp: jest.fn().mockResolvedValue(undefined),
    deferReply: jest.fn().mockResolvedValue(undefined),
    deleteReply: jest.fn().mockResolvedValue(undefined),
    createdTimestamp: Date.now(),
    client: {
      ws: { ping: 42 }
    },
    deferred: false,
    replied: false,
    options: {
      getString: jest.fn(),
      getInteger: jest.fn(),
      getBoolean: jest.fn(),
      getUser: jest.fn(),
      getChannel: jest.fn(),
      getRole: jest.fn(),
      getMentionable: jest.fn(),
      getNumber: jest.fn(),
      getSubcommand: jest.fn(),
      getSubcommandGroup: jest.fn(),
      getFocused: jest.fn(),
      data: {}
    },
    commandId: 'mock-command-id',
    commandName: 'mock-command',
    commandType: 1,
    guildId: 'mock-guild-id',
    user: {
      id: 'mock-user-id',
      username: 'mock-user',
      discriminator: '0000',
      avatar: null,
      bot: false,
      system: false,
      flags: { bitfield: 0 },
      createdTimestamp: Date.now(),
      tag: 'mock-user#0000',
      avatarURL: jest.fn(),
      displayAvatarURL: jest.fn()
    },
    member: {
      id: 'mock-user-id',
      guild: {
        id: 'mock-guild-id',
        name: 'Mock Guild'
      }
    },
    channel: {
      id: 'mock-channel-id',
      name: 'mock-channel'
    },
    token: 'mock-token',
    applicationId: 'mock-app-id',
    guild: {
      id: 'mock-guild-id',
      name: 'Mock Guild'
    }
  };

  // Merge default mock with overrides
  const mockInteraction = {
    ...defaultMock,
    ...overrides,
    // Deep merge for nested objects
    options: { ...defaultMock.options, ...overrides.options },
    client: { ...defaultMock.client, ...overrides.client },
    user: { ...defaultMock.user, ...overrides.user },
    member: { ...defaultMock.member, ...overrides.member },
    guild: { ...defaultMock.guild, ...overrides.guild },
    channel: { ...defaultMock.channel, ...overrides.channel }
  };

  // Add required ChatInputCommandInteraction properties
  (mockInteraction as any).transformOption = jest.fn();
  (mockInteraction as any)._cacheType = undefined;

  return mockInteraction as unknown as ChatInputCommandInteraction;
}

/**
 * Creates a mock client for testing Discord bot functionality
 * @param overrides Optional properties to override default mock values
 * @returns A mock Discord client
 */
export function createMockClient(overrides: Partial<MockClient> = {}): MockClient {
  const defaultMock: MockClient = {
    ws: {
      ping: 42
    },
    user: {
      id: 'mock-bot-id',
      tag: 'mock-bot#0000'
    },
    commands: new Map()
  };

  return {
    ...defaultMock,
    ...overrides,
    ws: { ...defaultMock.ws, ...overrides.ws },
    user: { ...defaultMock.user, ...overrides.user }
  };
}

/**
 * Creates a mock channel for testing Discord functionality
 * @param overrides Optional properties to override default mock values
 * @returns A mock Discord channel
 */
export function createMockChannel(overrides: Partial<MockChannel> = {}): MockChannel {
  const defaultMock: MockChannel = {
    id: 'mock-channel-id',
    name: 'mock-channel',
    send: jest.fn().mockResolvedValue(undefined),
    messages: {
      fetch: jest.fn().mockResolvedValue(new Map())
    }
  };

  return {
    ...defaultMock,
    ...overrides,
    messages: { ...defaultMock.messages, ...overrides.messages }
  };
}

/**
 * Creates a mock guild for testing Discord server functionality
 * @param overrides Optional properties to override default mock values
 * @returns A mock Discord guild
 */
export function createMockGuild(overrides: Partial<MockGuild> = {}): MockGuild {
  const defaultMock: MockGuild = {
    id: 'mock-guild-id',
    name: 'Mock Guild',
    channels: {
      cache: new Map()
    }
  };

  return {
    ...defaultMock,
    ...overrides,
    channels: { ...defaultMock.channels, ...overrides.channels }
  };
}
