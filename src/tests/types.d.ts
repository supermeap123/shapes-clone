import type { ChatInputCommandInteraction } from 'discord.js';
import type { Config } from '@jest/types';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(expected: any): R;
      toHaveBeenCalled(): R;
    }

    type Mocked<T> = {
      [P in keyof T]: T[P] extends (...args: any[]) => any
        ? jest.Mock<ReturnType<T[P]>, Parameters<T[P]>>
        : T[P] extends object
        ? Mocked<T[P]>
        : T[P];
    };
  }

  // Jest globals
  const jest: typeof import('@jest/globals').jest;
  const expect: typeof import('@jest/globals').expect;
  const describe: typeof import('@jest/globals').describe;
  const it: typeof import('@jest/globals').it;
  const test: typeof import('@jest/globals').test;
  const beforeAll: typeof import('@jest/globals').beforeAll;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const afterAll: typeof import('@jest/globals').afterAll;
  const afterEach: typeof import('@jest/globals').afterEach;

  // Custom test types
  interface MockInteraction {
    reply: jest.Mock;
    editReply: jest.Mock;
    followUp: jest.Mock;
    deferReply: jest.Mock;
    deleteReply: jest.Mock;
    options: {
      getString: jest.Mock;
      getInteger: jest.Mock;
      getBoolean: jest.Mock;
      getUser: jest.Mock;
      getChannel: jest.Mock;
      getRole: jest.Mock;
      getMentionable: jest.Mock;
      getNumber: jest.Mock;
      getSubcommand: jest.Mock;
      getSubcommandGroup: jest.Mock;
      getFocused: jest.Mock;
      data: Record<string, any>;
    };
    client: {
      ws: { ping: number };
      user?: {
        id: string;
        tag: string;
      };
    };
    user: {
      id: string;
      tag: string;
      username: string;
      discriminator: string;
      avatar: string | null;
      bot: boolean;
      system: boolean;
      flags: { bitfield: number };
      createdTimestamp: number;
      avatarURL: jest.Mock;
      displayAvatarURL: jest.Mock;
    };
    member?: {
      id: string;
      guild: {
        id: string;
        name: string;
      };
    };
    guild?: {
      id: string;
      name: string;
    };
    channel?: {
      id: string;
      name: string;
    };
    guildId?: string;
    commandId?: string;
    commandName?: string;
    commandType?: number;
    deferred: boolean;
    replied: boolean;
    createdTimestamp: number;
    token?: string;
    applicationId?: string;
  }

  interface MockClient {
    ws: {
      ping: number;
    };
    user: {
      id: string;
      tag: string;
    };
    commands: Map<string, any>;
  }

  interface MockChannel {
    id: string;
    name: string;
    send: jest.Mock;
    messages: {
      fetch: jest.Mock;
    };
  }

  interface MockGuild {
    id: string;
    name: string;
    channels: {
      cache: Map<string, MockChannel>;
    };
  }
}

export {};
