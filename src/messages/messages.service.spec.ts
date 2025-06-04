import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;

  const mockMessage = {
    id: '1',
    senderId: 'sender-1',
    receiverId: 'receiver-1',
    content: 'Test message',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessagesService],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const createMessageDto = {
        receiverId: 'receiver-1',
        content: 'Test message',
      };

      jest.spyOn(service, 'createMessage').mockResolvedValue(mockMessage);

      const result = await service.createMessage('sender-1', createMessageDto);

      expect(result).toBeDefined();
      expect(result.senderId).toBe('sender-1');
      expect(result.receiverId).toBe(createMessageDto.receiverId);
      expect(result.content).toBe(createMessageDto.content);
    });
  });

  describe('getMessagesBetweenUsers', () => {
    it('should return messages between two users', async () => {
      const user1Id = 'user-1';
      const user2Id = 'user-2';
      const mockMessages = [mockMessage];

      jest
        .spyOn(service, 'getMessagesBetweenUsers')
        .mockResolvedValue(mockMessages);

      const result = await service.getMessagesBetweenUsers(user1Id, user2Id);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].senderId).toBe(mockMessage.senderId);
      expect(result[0].receiverId).toBe(mockMessage.receiverId);
    });

    it('should return empty array if no messages found', async () => {
      const user1Id = 'user-1';
      const user2Id = 'user-2';

      jest.spyOn(service, 'getMessagesBetweenUsers').mockResolvedValue([]);

      const result = await service.getMessagesBetweenUsers(user1Id, user2Id);

      expect(result).toBeDefined();
      expect(result).toHaveLength(0);
    });
  });

  describe('getUserConversations', () => {
    it('should return user conversations', async () => {
      const userId = 'user-1';
      const mockConversations = [
        {
          userId: 'user-2',
          lastMessage: mockMessage,
          unreadCount: 1,
        },
      ];

      jest
        .spyOn(service, 'getUserConversations')
        .mockResolvedValue(mockConversations);

      const result = await service.getUserConversations(userId);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].lastMessage).toBeDefined();
      expect(result[0].unreadCount).toBeDefined();
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark messages as read', async () => {
      const userId = 'user-1';
      const senderId = 'sender-1';

      jest.spyOn(service, 'markMessagesAsRead').mockResolvedValue(void 0);

      await service.markMessagesAsRead(userId, senderId);

      expect(service.markMessagesAsRead).toHaveBeenCalledWith(userId, senderId);
    });
  });
});
