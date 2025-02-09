# Shapes Clone

A TypeScript implementation of the shapes.inc platform, featuring a Discord bot with advanced AI capabilities and a web administration interface.

## Features

- **Discord Bot Integration**
  - Slash command system
  - Dynamic personality customization
  - Memory management system
  - Chat revival functionality
  - Moderation tools
  - Server management utilities

- **Web Administration Panel**
  - Bot configuration interface
  - AI model settings
  - Memory management
  - Server-specific settings
  - Analytics dashboard

- **AI Integration**
  - OpenRouter API integration
  - Multiple model support
  - Fallback mechanisms
  - Context-aware responses
  - Memory retention

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Discord Bot Token
- OpenRouter API Key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shapes-clone.git
cd shapes-clone
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
# Discord Configuration
DISCORD_TOKEN=your_discord_token_here
CLIENT_ID=your_client_id_here

# Web Server Configuration
PORT=3000

# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Feature Flags
ENABLE_DMS=false
ENABLE_SERVER_LISTING=false

# Development
NODE_ENV=development
```

## Development

Start the development server:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

Format code:
```bash
npm run format
```

Lint code:
```bash
npm run lint
```

## Production Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Or use the deploy script:
```bash
npm run deploy
```

## Command System

### General Commands
- `/help` - Display available commands
- `/ping` - Check bot latency
- `/invite` - Get bot invite link
- `/debug` - View diagnostic information
- `/activate` - Activate the bot
- `/deactivate` - Deactivate the bot
- `/dashboard` - Access web dashboard
- `/shape` - Customize bot personality
- `/resetmemory` - Reset bot memory
- `/search` - Search available shapes
- `/sleep` - Process memory updates
- `/clearmemory` - Clear memory buffer
- `/revivechat` - Revive inactive chats

### Moderation Commands
- Kick, ban, and mute management
- Message purging
- Channel management
- Role management
- Server configuration

## Web Dashboard

The web administration panel is accessible at `http://localhost:3000/dashboard` (or your configured domain). Use the `/dashboard` command to generate an access token.

### Dashboard Features
- Server Configuration
- Bot Settings
- Memory Management
- Analytics
- Logs
- User Management

## Memory System

The bot implements a sophisticated memory system with:
- Short-term conversation memory
- Long-term learning patterns
- Memory optimization during sleep
- Selective memory clearing
- Chat context awareness

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Discord.js team
- OpenRouter API
- Original shapes.inc platform

## Support

For support, please:
1. Check the [documentation](docs/)
2. Open an issue
3. Join our [Discord server](https://discord.gg/your-server)

## Security

Please report security vulnerabilities to security@yourdomain.com

## Project Structure

```
shapes-clone/
├── src/
│   ├── config/         # Configuration files
│   ├── discord/        # Discord bot implementation
│   │   ├── commands/   # Command handlers
│   │   ├── events/     # Event handlers
│   │   └── types/      # TypeScript types
│   ├── web/           # Web dashboard
│   ├── utils/         # Utility functions
│   └── index.ts       # Entry point
├── tests/             # Test files
├── docs/             # Documentation
└── dist/             # Compiled JavaScript
