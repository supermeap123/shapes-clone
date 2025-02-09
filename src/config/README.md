# Configuration Management

## Overview

The configuration management system provides a robust and type-safe way to handle application settings. It supports:

1. Default configuration values
2. Environment variable overrides
3. Nested configuration keys
4. Configuration validation

## Usage

### Loading Configuration

```typescript
import { ConfigLoader } from './index';

const config = ConfigLoader.load();
```

### Configuration Structure

```typescript
export interface AppConfig {
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
```

## Environment Variables

The following environment variables can be used to override default configuration:

| Variable Name           | Configuration Key            | Type    | Default Value |
|-------------------------|------------------------------|---------|---------------|
| BOT_TOKEN               | botToken                    | string  | ''            |
| CLIENT_ID               | clientId                    | string  | ''            |
| GUILD_ID                | guildId                     | string  | ''            |
| DATABASE_URL            | databaseUrl                 | string  | ''            |
| MODERATION_LOG_CHANNEL  | moderation.logChannelId     | string  | ''            |
| LOG_LEVEL               | logging.level               | string  | 'info'        |
| FILE_LOGGING            | logging.fileLogging         | boolean | false         |
| FEATURE_DASHBOARD       | features.dashboard          | boolean | false         |
| FEATURE_MODERATION      | features.moderation         | boolean | true          |
| FEATURE_ANALYTICS       | features.analytics          | boolean | false         |

## Validation

The configuration system performs the following validations:

1. Required fields check
2. Moderation log channel presence when moderation is enabled
3. Proper type checking for all configuration values

## Implementation Details

1. **Type-Safe Nested Keys**: The system uses a depth-limited recursive type to handle nested configuration keys safely.
2. **Environment Variable Mapping**: A type-safe mapping of environment variables to configuration keys is maintained.
3. **Validation System**: The ConfigValidator class ensures all required fields are present and valid.
4. **Default Configuration**: Provides sensible defaults for all configuration values.

## Testing

The configuration system includes comprehensive unit tests covering:

1. Default configuration loading
2. Environment variable overrides
3. Validation checks
4. Nested configuration handling

Tests can be found in `src/tests/config.test.ts`.
