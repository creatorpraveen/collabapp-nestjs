import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = await service.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(result.name).toBe(createUserDto.name);
      expect(result.password).not.toBe(createUserDto.password);
      expect(
        await bcrypt.compare(createUserDto.password, result.password),
      ).toBeTruthy();
    });

    it('should throw error if user with email already exists', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      await service.create(createUserDto);

      await expect(service.create(createUserDto)).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const createdUser = await service.create(createUserDto);
      const foundUser = await service.findByEmail(createUserDto.email);

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe(createUserDto.email);
      expect(foundUser.id).toBe(createdUser.id);
    });

    it('should return null if user not found', async () => {
      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const createdUser = await service.create(createUserDto);
      const foundUser = await service.findById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.email).toBe(createUserDto.email);
    });

    it('should return null if user not found', async () => {
      const result = await service.findById('nonexistent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const createdUser = await service.create(createUserDto);
      const updateDto = {
        name: 'Updated Name',
      };

      const updatedUser = await service.updateProfile(
        createdUser.id,
        updateDto,
      );

      expect(updatedUser).toBeDefined();
      expect(updatedUser.name).toBe(updateDto.name);
      expect(updatedUser.email).toBe(createdUser.email);
    });

    it('should throw error if user not found', async () => {
      const updateDto = {
        name: 'Updated Name',
      };

      await expect(
        service.updateProfile('nonexistent-id', updateDto),
      ).rejects.toThrow();
    });
  });
});
