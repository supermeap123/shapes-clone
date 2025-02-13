# Shapes Clone - AI Personality Management API

A comprehensive API for managing AI personalities (shapes) with customizable profiles, behaviors, and settings.

## Features

- Complete shape management with customizable profiles
- Personality and behavior configuration
- Free will and autonomous behavior settings
- Knowledge base and training management
- AI engine configuration with multiple model support
- Image generation capabilities
- Voice response integration
- Advanced settings and privacy controls
- JWT-based authentication and authorization
- Role-based access control
- MongoDB integration
- Cloudinary integration for media storage
- Comprehensive error handling
- API rate limiting
- CORS support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Redis (optional, for caching)
- Cloudinary account (for image uploads)
- OpenAI API key
- OpenPipe API key
- Stable Diffusion API key (for image generation)
- ElevenLabs API key (for voice generation)

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

3. Create a .env file based on .env.example:
   ```bash
   cp .env.example .env
   ```

4. Update the .env file with your configuration values.

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Profile Management
- `GET /api/v1/profile/:shapeId` - Get shape profile
- `PUT /api/v1/profile/:shapeId` - Update shape profile

### Personality Configuration
- `GET /api/v1/personality/:shapeId` - Get personality settings
- `PUT /api/v1/personality/:shapeId` - Update personality settings

### Free Will Settings
- `GET /api/v1/freewill/:shapeId` - Get free will settings
- `PUT /api/v1/freewill/:shapeId` - Update free will settings
- `PUT /api/v1/freewill/:shapeId/reactions` - Update reactions settings
- `PUT /api/v1/freewill/:shapeId/keywords` - Update keywords of interest

### Knowledge Management
- `GET /api/v1/knowledge/:shapeId` - Get knowledge settings
- `PUT /api/v1/knowledge/:shapeId` - Update knowledge settings
- `PUT /api/v1/knowledge/:shapeId/general` - Update general knowledge
- `PUT /api/v1/knowledge/:shapeId/commands` - Update commands
- `PUT /api/v1/knowledge/:shapeId/relationships` - Update relationships

### Training Management
- `GET /api/v1/training/:shapeId` - Get training settings
- `PUT /api/v1/training/:shapeId` - Update training settings
- `POST /api/v1/training/:shapeId/snippets` - Add conversation snippet
- `DELETE /api/v1/training/:shapeId/snippets/:index` - Remove conversation snippet

### AI Engine Configuration
- `GET /api/v1/ai-engine/:shapeId` - Get AI engine settings
- `PUT /api/v1/ai-engine/:shapeId` - Update AI engine settings
- `PUT /api/v1/ai-engine/:shapeId/memory` - Update memory settings
- `PUT /api/v1/ai-engine/:shapeId/language-presets` - Update language presets
- `PUT /api/v1/ai-engine/:shapeId/engine-presets` - Update engine presets

### Image Engine Configuration
- `GET /api/v1/image-engine/:shapeId` - Get image engine settings
- `PUT /api/v1/image-engine/:shapeId` - Update image engine settings
- `PUT /api/v1/image-engine/:shapeId/size-options` - Update image size options
- `PUT /api/v1/image-engine/:shapeId/command-prefix` - Update command prefix
- `PUT /api/v1/image-engine/:shapeId/preset` - Update image preset

### Voice Engine Configuration
- `GET /api/v1/voice-engine/:shapeId` - Get voice engine settings
- `PUT /api/v1/voice-engine/:shapeId` - Update voice engine settings
- `PUT /api/v1/voice-engine/:shapeId/toggle` - Toggle voice responses

### Settings Management
- `GET /api/v1/settings/:shapeId` - Get general settings
- `PUT /api/v1/settings/:shapeId` - Update general settings
- `PUT /api/v1/settings/:shapeId/privacy` - Update privacy settings
- `PUT /api/v1/settings/:shapeId/messages` - Update custom messages
- `PUT /api/v1/settings/:shapeId/commands` - Update slash commands

### Admin Routes
- `GET /api/v1/admin/profile` - Get all profiles (admin only)
- `PUT /api/v1/admin/profile` - Bulk update profiles (admin only)

## Authentication

All routes except health check require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your-jwt-token
```

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details if available"
  }
}
```

## Development

1. Run tests:
   ```bash
   npm test
   ```

2. Run linting:
   ```bash
   npm run lint
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
