# Shapes Discord Bot

A Discord bot for managing and running AI shapes created through the Shapes web interface. The bot enables dynamic loading, management, and interaction with AI shapes in Discord servers.

## Features

- Dynamic shape loading and management from the web UI
- Real-time shape configuration updates
- AI-powered conversations using OpenRouter
- Short-term and long-term memory management
- Autonomous engagement and free will behaviors
- Multimedia support (reactions, images, voice)
- Comprehensive logging and debugging tools

## Prerequisites

- Node.js >= 16.9.0
- MongoDB database
- Discord Bot Token
- OpenRouter API Key
- Access to the Shapes Web UI

## Installation

1. Clone the repository and navigate to the discord directory:
```bash
cd src/discord
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_GUILD_ID=your_discord_guild_id

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/shapes

# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_API_URL=https://openrouter.ai/api/v1

# Web UI Integration
WEBUI_API_URL=http://localhost:3000/api
WEBUI_API_KEY=your_webui_api_key

# Memory Configuration
MEMORY_RETENTION_DAYS=30
SHORT_TERM_MEMORY_LIMIT=10
LONG_TERM_MEMORY_LIMIT=100

# Logging Configuration
LOG_LEVEL=info
```

## Building

Build the TypeScript code:
```bash
npm run build
```

## Running

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Architecture

The bot is structured into several key components:

### Core Services

- **ShapeManager**: Handles loading and managing shapes from the web UI
- **AIService**: Manages AI model selection and inference via OpenRouter
- **MemoryService**: Handles short-term and long-term memory management

### Event Handlers

- **MessageHandler**: Processes incoming messages and generates responses
- **Bot**: Main Discord client and event management

## Shape Configuration

Shapes are configured through the web UI and include:

- Profile settings
- Personality traits
- Free will behaviors
- Knowledge base
- AI model preferences
- Memory settings
- Privacy controls

## Memory System

The bot implements a two-tier memory system:

- **Short-term Memory**: Recent interactions and context
- **Long-term Memory**: Important facts and learned behaviors

Memory limits and retention periods are configurable through environment variables.

## Development

### Available Scripts

- `npm run build`: Build the TypeScript code
- `npm start`: Run the built code
- `npm run dev`: Run in development mode with hot reload
- `npm run watch`: Watch for TypeScript changes
- `npm run lint`: Run ESLint
- `npm run clean`: Clean build artifacts

### Adding New Features

1. Create new services in `src/services/`
2. Add event handlers in `src/handlers/`
3. Update types in `src/types/`
4. Add configuration in `src/config/`

## Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify Discord token and permissions
   - Check MongoDB connection string
   - Ensure Web UI is accessible

2. **Shape Loading Issues**:
   - Verify Web UI API key
   - Check shape configurations
   - Review database connectivity

3. **Memory Issues**:
   - Adjust memory limits in environment variables
   - Check MongoDB storage capacity
   - Monitor memory usage patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License
