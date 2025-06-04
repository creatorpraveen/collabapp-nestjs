import { Test, TestingModule } from '@nestjs/testing';
import { CollaborationsService } from './collaborations.service';
import { CollaborationStatus } from './collaboration-status.enum';

describe('CollaborationsService', () => {
  let service: CollaborationsService;

  const mockCollaboration = {
    id: '1',
    creatorId: 'creator-1',
    collaboratorId: 'collaborator-1',
    status: CollaborationStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollaborationsService],
    }).compile();

    service = module.get<CollaborationsService>(CollaborationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCollaboration', () => {
    it('should create a new collaboration request', async () => {
      const createCollabDto = {
        collaboratorId: 'collaborator-1',
        projectName: 'Test Project',
        description: 'Test Description',
      };

      jest.spyOn(service, 'createCollaboration').mockResolvedValue({
        ...mockCollaboration,
        projectName: createCollabDto.projectName,
        description: createCollabDto.description,
      });

      const result = await service.createCollaboration(
        'creator-1',
        createCollabDto,
      );

      expect(result).toBeDefined();
      expect(result.creatorId).toBe('creator-1');
      expect(result.collaboratorId).toBe(createCollabDto.collaboratorId);
      expect(result.status).toBe(CollaborationStatus.PENDING);
      expect(result.projectName).toBe(createCollabDto.projectName);
    });

    it('should throw error if collaboration already exists', async () => {
      const createCollabDto = {
        collaboratorId: 'collaborator-1',
        projectName: 'Test Project',
        description: 'Test Description',
      };

      jest
        .spyOn(service, 'findExistingCollaboration')
        .mockResolvedValue(mockCollaboration);

      await expect(
        service.createCollaboration('creator-1', createCollabDto),
      ).rejects.toThrow();
    });
  });

  describe('updateCollaborationStatus', () => {
    it('should update collaboration status to accepted', async () => {
      const updateDto = {
        status: CollaborationStatus.ACCEPTED,
      };

      jest.spyOn(service, 'findById').mockResolvedValue(mockCollaboration);
      jest.spyOn(service, 'updateCollaborationStatus').mockResolvedValue({
        ...mockCollaboration,
        status: CollaborationStatus.ACCEPTED,
      });

      const result = await service.updateCollaborationStatus('1', updateDto);

      expect(result).toBeDefined();
      expect(result.status).toBe(CollaborationStatus.ACCEPTED);
    });

    it('should throw error if collaboration not found', async () => {
      const updateDto = {
        status: CollaborationStatus.ACCEPTED,
      };

      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(
        service.updateCollaborationStatus('1', updateDto),
      ).rejects.toThrow();
    });
  });

  describe('getCollaborationsByUser', () => {
    it('should return collaborations for user', async () => {
      const userId = 'user-1';
      const mockCollaborations = [mockCollaboration];

      jest
        .spyOn(service, 'getCollaborationsByUser')
        .mockResolvedValue(mockCollaborations);

      const result = await service.getCollaborationsByUser(userId);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0].creatorId).toBe(mockCollaboration.creatorId);
    });
  });

  describe('findById', () => {
    it('should return collaboration if found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockCollaboration);

      const result = await service.findById('1');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
    });

    it('should return null if collaboration not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      const result = await service.findById('nonexistent');

      expect(result).toBeNull();
    });
  });
});
