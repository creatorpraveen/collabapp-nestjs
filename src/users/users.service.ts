import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { CassandraService } from '../database/cassandra.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private cassandraService: CassandraService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const query =
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)';
    const params = [
      userId,
      createUserDto.name,
      createUserDto.email.toLowerCase(),
      hashedPassword,
      createUserDto.role,
    ];

    await this.cassandraService.execute(query, params, { prepare: true });

    return {
      id: userId,
      name: createUserDto.name,
      email: createUserDto.email,
      role: createUserDto.role,
    };
  }

  async findByEmail(email: string) {
    if (!email) {
      return null;
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await this.cassandraService.execute(
      query,
      [email.toLowerCase()],
      { prepare: true },
    );
    return result.rows[0];
  }

  async findById(id: string) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const result = await this.cassandraService.execute(query, [id], {
      prepare: true,
    });

    if (!result.rows[0]) {
      throw new NotFoundException('User not found');
    }

    return result.rows[0];
  }

  async validatePassword(user: any, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
