import { ChatInputCommandInteraction } from 'discord.js';
import { pingCommand } from '../../../discord/commands/general/ping';
import { logger } from '../../../utils/logger';
import { createMockInteraction } from '../../helpers';

describe('Ping Command', () => {
  let mockInteraction: ChatInputCommandInteraction;

  beforeEach(() => {
    mockInteraction = createMockInteraction({
      commandName: 'ping',
      client: {
        ws: { ping: 42 }
      }
    });
  });

  it('should execute successfully', async () => {
    // Execute the command
    await pingCommand.execute(mockInteraction);

    // Verify initial reply was sent
    expect(mockInteraction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Pinging...',
        fetchReply: true
      })
    );

    // Verify edit reply was called with embed
    expect(mockInteraction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: '',
        embeds: [expect.any(Object)]
      })
    );

    // Verify logger was called
    expect(logger.debug).toHaveBeenCalledWith(
      'Ping command executed:',
      expect.objectContaining({
        wsLatency: 42,
        roundtripLatency: expect.any(Number)
      })
    );
  });

  it('should handle errors gracefully', async () => {
    // Mock reply to throw an error
    mockInteraction.reply = jest.fn().mockRejectedValue(new Error('Test error'));

    // Execute the command
    await pingCommand.execute(mockInteraction as unknown as ChatInputCommandInteraction);

    // Verify error was logged
    expect(logger.error).toHaveBeenCalledWith(
      'Error executing ping command:',
      expect.any(Error)
    );

    // Verify error message was sent
    expect(mockInteraction.reply).toHaveBeenCalledWith({
      content: 'There was an error while checking the ping!',
      ephemeral: true
    });
  });

  it('should have correct command structure', () => {
    expect(pingCommand.data.name).toBe('ping');
    expect(pingCommand.data.description).toBe('Check the bot\'s response time');
    expect(pingCommand.cooldown).toBe(5);
  });
});
