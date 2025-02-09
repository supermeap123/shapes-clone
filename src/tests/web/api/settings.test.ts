import request from 'supertest';
import { app } from '../../../web/server';
import { SettingsService } from '../../../services/settings';
import { createMockSettings, createMockSettingsUpdate } from '../../helpers/mockSettings';
import { logger } from '../../../utils/logger';

// Mock services and logger
jest.mock('../../../services/settings');
jest.mock('../../../utils/logger');

describe('Settings API', () => {
  const mockGuildId = '123456789';
  const mockToken = 'valid-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/settings/:guildId', () => {
    it('should return settings for valid guild', async () => {
      const mockSettings = createMockSettings(mockGuildId);
      (SettingsService.getGuildSettings as jest.Mock).mockResolvedValue(mockSettings);

      const response = await request(app)
        .get(`/api/settings/${mockGuildId}`)
        .query({ token: mockToken });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSettings);
      expect(SettingsService.getGuildSettings).toHaveBeenCalledWith(mockGuildId);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get(`/api/settings/${mockGuildId}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'No token provided' });
      expect(SettingsService.getGuildSettings).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      (SettingsService.getGuildSettings as jest.Mock).mockRejectedValue(
        new Error('Service error')
      );

      const response = await request(app)
        .get(`/api/settings/${mockGuildId}`)
        .query({ token: mockToken });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith(
        'Server error:',
        expect.any(Error)
      );
    });
  });

  describe('POST /api/settings/:guildId', () => {
    it('should update settings for valid guild', async () => {
      const updateData = createMockSettingsUpdate({
        personality: {
          backstory: 'Updated backstory',
          traits: ['updated', 'traits'],
          tone: 'professional',
          likes: ['updated likes'],
          dislikes: ['updated dislikes'],
          conversationStyle: 'formal'
        }
      });

      const mockUpdatedSettings = createMockSettings(mockGuildId, updateData);
      (SettingsService.updateGuildSettings as jest.Mock).mockResolvedValue(mockUpdatedSettings);

      const response = await request(app)
        .post(`/api/settings/${mockGuildId}`)
        .query({ token: mockToken })
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockUpdatedSettings
      });
      expect(SettingsService.updateGuildSettings).toHaveBeenCalledWith(
        mockGuildId,
        updateData
      );
    });

    it('should validate request body', async () => {
      const invalidData = {
        personality: {
          // Missing required fields
          backstory: 123 // Invalid type
        }
      };

      const response = await request(app)
        .post(`/api/settings/${mockGuildId}`)
        .query({ token: mockToken })
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: expect.stringContaining('Invalid settings')
      });
      expect(SettingsService.updateGuildSettings).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const updateData = createMockSettingsUpdate();
      (SettingsService.updateGuildSettings as jest.Mock).mockRejectedValue(
        new Error('Service error')
      );

      const response = await request(app)
        .post(`/api/settings/${mockGuildId}`)
        .query({ token: mockToken })
        .send(updateData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith(
        'Server error:',
        expect.any(Error)
      );
    });

    it('should require authentication', async () => {
      const updateData = createMockSettingsUpdate();

      const response = await request(app)
        .post(`/api/settings/${mockGuildId}`)
        .send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'No token provided' });
      expect(SettingsService.updateGuildSettings).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/settings/:guildId', () => {
    it('should delete settings for valid guild', async () => {
      const response = await request(app)
        .delete(`/api/settings/${mockGuildId}`)
        .query({ token: mockToken });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Settings deleted successfully'
      });
      expect(SettingsService.deleteGuildSettings).toHaveBeenCalledWith(mockGuildId);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete(`/api/settings/${mockGuildId}`);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'No token provided' });
      expect(SettingsService.deleteGuildSettings).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      (SettingsService.deleteGuildSettings as jest.Mock).mockRejectedValue(
        new Error('Service error')
      );

      const response = await request(app)
        .delete(`/api/settings/${mockGuildId}`)
        .query({ token: mockToken });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
      expect(logger.error).toHaveBeenCalledWith(
        'Server error:',
        expect.any(Error)
      );
    });
  });
});
