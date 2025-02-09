// Configuration Management
import { logger } from '../utils/logger';
import { ModerationRule } from '../utils/moderation';
import { defaultModerationRules } from '../utils/moderation';

// Define configuration interface
export interface AppConfig {
    [key: string]: any; // Index signature
    botToken: string;
    clientId: string;
    guildId: string;
    databaseUrl: string;
    moderation: {
        enabled: boolean;
        rules: ModerationRule[];
        logChannelId: string;
    };
    logging: {
        level: 'debug' | 'info' | 'warn' | 'error';
        fileLogging: boolean;
    };
    features: {
        dashboard: boolean;
        moderation: boolean;
        analytics: boolean;
    };
}

// Default configuration
export const defaultConfig: AppConfig = {
    botToken: process.env.BOT_TOKEN || '',
    clientId: process.env.CLIENT_ID || '',
    guildId: process.env.GUILD_ID || '',
    databaseUrl: process.env.DATABASE_URL || '',
    moderation: {
        enabled: true,
        rules: defaultModerationRules,
        logChannelId: process.env.MODERATION_LOG_CHANNEL || ''
    },
    logging: {
        level: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
        fileLogging: process.env.FILE_LOGGING === 'true'
    },
    features: {
        dashboard: process.env.FEATURE_DASHBOARD === 'true',
        moderation: process.env.FEATURE_MODERATION !== 'false',
        analytics: process.env.FEATURE_ANALYTICS === 'true'
    }
};

// Configuration validation
export class ConfigValidator {
    public static validate(config: AppConfig): string[] {
        const errors: string[] = [];
        const requiredFields = ['botToken', 'clientId', 'guildId', 'databaseUrl'];

        for (const field of requiredFields) {
            if (!config[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        }

        if (config.moderation.enabled && !config.moderation.logChannelId) {
            errors.push('Moderation log channel ID is required when moderation is enabled');
        }

        return errors;
    }
}

// Configuration loader
export class ConfigLoader {
    public static load(): AppConfig {
        const config = { ...defaultConfig };

// Environment overrides with type checking
type NestedKey<T, Depth extends number = 5> = {
    [K in keyof T]: 
        Depth extends 0 ? 
        never : 
        T[K] extends object ? 
        K | `${K & string}.${NestedKey<T[K], SubtractOne<Depth>> & string}` : 
        K;
}[keyof T];

type SubtractOne<N extends number> = [-1, 0, 1, 2, 3, 4, 5][N];

const envOverrides: { [key: string]: NestedKey<AppConfig> } = {
    BOT_TOKEN: 'botToken',
    CLIENT_ID: 'clientId',
    GUILD_ID: 'guildId',
    DATABASE_URL: 'databaseUrl',
    MODERATION_LOG_CHANNEL: 'moderation.logChannelId',
    LOG_LEVEL: 'logging.level',
    FILE_LOGGING: 'logging.fileLogging',
    FEATURE_DASHBOARD: 'features.dashboard',
    FEATURE_MODERATION: 'features.moderation',
    FEATURE_ANALYTICS: 'features.analytics'
};

for (const [envKey, configKey] of Object.entries(envOverrides)) {
    if (process.env[envKey] && typeof configKey === 'string') {
        const keys = configKey.split('.');
        if (keys.length === 1) {
            config[keys[0]] = process.env[envKey];
        } else {
            (config as any)[keys[0]][keys[1]] = process.env[envKey];
        }
    }
}

        // Validate configuration
        const errors = ConfigValidator.validate(config);
        if (errors.length > 0) {
            logger.error('Configuration validation failed:');
            errors.forEach(error => logger.error(error));
            throw new Error('Invalid configuration');
        }

        return config;
    }
}
