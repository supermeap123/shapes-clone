import request from 'supertest';
import { app } from '../../web/server';
import { logger } from '../../utils/logger';

// Mock logger
jest.mock('../../utils/logger');

describe('Web Server', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    it('should return ok status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Dashboard Access', () => {
    it('should require token for dashboard access', async () => {
      const response = await request(app).get('/dashboard/123456789');
      
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'No token provided' });
    });

    it('should allow access with valid token', async () => {
      const mockToken = 'valid-token';
      const response = await request(app)
        .get('/dashboard/123456789')
        .query({ token: mockToken });
      
      expect(response.status).toBe(200);
      expect(response.header['content-type']).toMatch(/text\/html/);
    });
  });

  describe('Error Handling', () => {
    it('should handle internal server errors', async () => {
      // Mock an endpoint that throws an error
      app.get('/api/test-error', () => {
        throw new Error('Test error');
      });

      const response = await request(app).get('/api/test-error');
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith(
        'Server error:',
        expect.any(Error)
      );
    });
  });

  describe('API Endpoints', () => {
    describe('GET /api/settings/:guildId', () => {
      it('should return guild settings', async () => {
        const guildId = '123456789';
        const mockToken = 'valid-token';

        const response = await request(app)
          .get(`/api/settings/${guildId}`)
          .query({ token: mockToken });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('guildId', guildId);
        expect(response.body).toHaveProperty('personality');
        expect(response.body).toHaveProperty('memory');
        expect(response.body).toHaveProperty('commands');
      });

      it('should require authentication', async () => {
        const response = await request(app).get('/api/settings/123456789');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'No token provided' });
      });
    });

    describe('POST /api/settings/:guildId', () => {
      it('should update guild settings', async () => {
        const guildId = '123456789';
        const mockToken = 'valid-token';
        const mockSettings = {
          guildId,
          personality: {
            backstory: 'Test backstory',
            traits: ['friendly', 'helpful'],
            conversationStyle: 'casual'
          },
          memory: {
            retention: 100,
            revivalThreshold: 30,
            timeAware: true
          },
          commands: [
            { name: 'help', enabled: true },
            { name: 'ping', enabled: true }
          ]
        };

        const response = await request(app)
          .post(`/api/settings/${guildId}`)
          .query({ token: mockToken })
          .send(mockSettings);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          success: true,
          data: expect.objectContaining({
            guildId,
            personality: expect.any(Object),
            memory: expect.any(Object),
            commands: expect.any(Array)
          })
        });
      });

      it('should validate settings data', async () => {
        const guildId = '123456789';
        const mockToken = 'valid-token';
        const invalidSettings = {
          guildId,
          personality: {
            // Missing required fields
          }
        };

        const response = await request(app)
          .post(`/api/settings/${guildId}`)
          .query({ token: mockToken })
          .send(invalidSettings);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          error: expect.stringContaining('Invalid settings')
        });
      });
    });

    describe('GET /api/commands/:guildId', () => {
      it('should return guild commands', async () => {
        const guildId = '123456789';
        const mockToken = 'valid-token';

        const response = await request(app)
          .get(`/api/commands/${guildId}`)
          .query({ token: mockToken });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('description');
        expect(response.body[0]).toHaveProperty('enabled');
      });
    });
  });
});
