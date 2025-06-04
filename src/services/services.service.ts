import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CassandraService } from '../database/cassandra.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private cassandraService: CassandraService) {}

  async create(createServiceDto: CreateServiceDto, ownerId: string) {
    const serviceId = uuidv4();
    const query =
      'INSERT INTO services (id, title, description, owner_id) VALUES (?, ?, ?, ?)';
    const params = [
      serviceId,
      createServiceDto.title,
      createServiceDto.description,
      ownerId,
    ];

    await this.cassandraService.execute(query, params, { prepare: true });

    return {
      id: serviceId,
      ...createServiceDto,
      ownerId,
    };
  }

  async findById(id: string) {
    const query = 'SELECT * FROM services WHERE id = ?';
    const result = await this.cassandraService.execute(query, [id], {
      prepare: true,
    });

    if (!result.rows[0]) {
      throw new NotFoundException('Service not found');
    }

    return result.rows[0];
  }

  async findByOwnerId(ownerId: string) {
    const query = 'SELECT * FROM services WHERE owner_id = ? ALLOW FILTERING';
    const result = await this.cassandraService.execute(query, [ownerId], {
      prepare: true,
    });
    return result.rows;
  }
}
