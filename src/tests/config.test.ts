// Configuration Tests
import { ConfigLoader } from '../config';
import { defaultModerationRules } from '../utils/moderation';

describe('Configuration Management', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = {};
    });

    test('should load default configuration', () => {
        const config = ConfigLoader.load();
        expect(config.botToken).toBe('');
        expect(config.clientId).toBe('');
        expect(config.guildId).toBe('');
        expect(config.databaseUrl).toBe('');
        expect(config.moderation.enabled).toBe(true);
        expect(config.moderation.rules).toEqual(defaultModerationRules);
        expect(config.moderation.logChannelId).toBe('');
        expect(config.logging.level).toBe('info');
        expect(config.logging.fileLogging).toBe(false);
        expect(config.features.dashboard).toBe(false);
        expect(config.features.moderation).toBe(true);
        expect(config.features.analytics).toBe(false);
    });

    test('should override with environment variables', () => {
        process.env = {
            BOT_TOKEN: 'test-token',
            CLIENT_ID: '1234567890',
            GUILD_ID: '0987654321',
            DATABASE_URL: 'mongodb://localhost:27017/test',
            MODERATION_LOG_CHANNEL: '1234',
            LOG_LEVEL: 'debug',
            FILE_LOGGING: 'true',
            FEATURE_DASHBOARD: 'true',
            FEATURE_MODERATION: 'false',
            FEATURE_ANALYTICS: 'true'
        };

        const config = ConfigLoader.load();
        expect(config.botToken).toBe('test-token');
        expect(config.clientId).toBe('1234567890');
        expect(config.guildId).toBe('0987654321');
        expect(config.databaseUrl).toBe('mongodb://localhost:27017/test');
        expect(config.moderation.logChannelId).toBe('1234');
        expect(config.logging.level).toBe('debug');
        expect(config.logging.fileLogging).toBe(true);
        expect(config.features.dashboard).toBe(true);
        expect(config.features.moderation).toBe(false);
        expect(config.features.analytics).toBe(true);
    });

    test('should validate required fields', () => {
        process.env = {
            CLIENT_ID: '1234567890',
            GUILD_ID: '0987654321',
            DATABASE_URL: 'mongodb://localhost:27017/test'
        };

        expect(() => ConfigLoader.load()).toThrow('Invalid configuration');
    });

    test('should require moderation log channel when enabled', () => {
        process.env = {
            BOT_TOKEN: 'test-token',
            CLIENT_ID: '1234567890',
            GUILD_ID: '0987654321',
            DATABASE_URL: 'mongodb://localhost:27017/test',
            MODERATION_LOG_CHANNEL: ''
        };

        expect(() => ConfigLoader.load()).toThrow('Invalid configuration');
    });

    test('should handle nested configuration properly', () => {
        process.env = {
            BOT_TOKEN: 'test-token',
            CLIENT_ID: '1234567890',
            GUILD_ID: '0987654321',
            DATABASE_URL: 'mongodb://localhost:27017/test',
            MODERATION_LOG_CHANNEL: '1234',
            LOG_LEVEL: 'warn',
            FILE_LOGGING: 'true',
            FEATURE_DASHBOARD: 'false',
            FEATURE_MODERATION: 'true',
            FEATURE_ANALYTICS: 'true'
        };

        const config = ConfigLoader.load();
        expect(config.moderation.logChannelId).toBe('1234');
        expect(config.logging.level).toBe('warn');
        expect(config.logging.fileLogging).toBe(true);
        expect(config.features.dashboard).toBe(false);
        expect(config.features.moderation).toBe(true);
        expect(config.features.analytics).toBe(true);
    });
});
