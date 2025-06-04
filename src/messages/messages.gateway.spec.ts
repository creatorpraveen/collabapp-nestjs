import { Test, TestingModule } from '@nestjs/testing';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { Socket } from 'socket.io';

describe('MessagesGateway', () => {
  let gateway: MessagesGateway;
  let messagesService: MessagesService;

  const mockClient = {
    id: 'socket-id',
    data: {
      user: {
        id: 'user-1',
        email: 'test@example.com',
      },
    },
  } as Socket;

  const mockMessage = {
    id: '1',
    senderId: 'user-1',
    receiverId: 'user-2',
    content: 'Test message',
    createdAt: new Date(),
  };

  const mockMessagesService = {
    createMessage: jest.fn(),
    getMessagesBetweenUsers: jest.fn(),
    markMessagesAsRead: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesGateway,
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    }).compile();

    gateway = module.get<MessagesGateway>(MessagesGateway);
    messagesService = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should handle new client connection', () => {
      const result = gateway.handleConnection(mockClient);

      expect(result).toBeUndefined();
    });
  });

  describe('handleDisconnect', () => {
    it('should handle client disconnect', () => {
      const result = gateway.handleDisconnect(mockClient);

      expect(result).toBeUndefined();
    });
  });

  describe('handleMessage', () => {
    it('should handle new message and emit to receiver', async () => {
      const payload = {
        receiverId: 'user-2',
        content: 'Test message',
      };

      mockMessagesService.createMessage.mockResolvedValue(mockMessage);

      const emitSpy = jest.spyOn(gateway.server, 'to').mockReturnValue({
        emit: jest.fn(),
      } as any);

      await gateway.handleMessage(mockClient, payload);

      expect(messagesService.createMessage).toHaveBeenCalledWith(
        mockClient.data.user.id,
        payload,
      );
      expect(emitSpy).toHaveBeenCalledWith('user-2');
    });
  });

  describe('handleTyping', () => {
    it('should emit typing status to receiver', () => {
      const payload = {
        receiverId: 'user-2',
        isTyping: true,
      };

      const emitSpy = jest.spyOn(gateway.server, 'to').mockReturnValue({
        emit: jest.fn(),
      } as any);

      gateway.handleTyping(mockClient, payload);

      expect(emitSpy).toHaveBeenCalledWith('user-2');
    });
  });

  describe('handleReadMessages', () => {
    it('should mark messages as read and emit to sender', async () => {
      const payload = {
        senderId: 'user-2',
      };

      const emitSpy = jest.spyOn(gateway.server, 'to').mockReturnValue({
        emit: jest.fn(),
      } as any);

      await gateway.handleReadMessages(mockClient, payload);

      expect(messagesService.markMessagesAsRead).toHaveBeenCalledWith(
        mockClient.data.user.id,
        payload.senderId,
      );
      expect(emitSpy).toHaveBeenCalledWith('user-2');
    });
  });
});
