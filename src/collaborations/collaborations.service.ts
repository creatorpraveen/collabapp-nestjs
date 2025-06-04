import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CassandraService } from '../database/cassandra.service';
import { CreateCollaborationDto } from './dto/create-collaboration.dto';
import { CollaborationStatus } from './collaboration-status.enum';
import { UserRole } from '../users/dto/create-user.dto';

@Injectable()
export class CollaborationsService {
  constructor(private cassandraService: CassandraService) {}

  async create(
    createCollaborationDto: CreateCollaborationDto,
    buyerId: string,
  ) {
    const collaborationId = uuidv4();
    const query = `
      INSERT INTO collaborations (
        id, buyer_id, seller_id, service_id, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      collaborationId,
      buyerId,
      createCollaborationDto.sellerId,
      createCollaborationDto.serviceId,
      CollaborationStatus.PENDING,
      new Date(),
    ];

    await this.cassandraService.execute(query, params, { prepare: true });

    return {
      id: collaborationId,
      buyerId,
      sellerId: createCollaborationDto.sellerId,
      serviceId: createCollaborationDto.serviceId,
      status: CollaborationStatus.PENDING,
      createdAt: new Date(),
    };
  }

  async findById(id: string) {
    const query = 'SELECT * FROM collaborations WHERE id = ?';
    const result = await this.cassandraService.execute(query, [id], {
      prepare: true,
    });

    if (!result.rows[0]) {
      throw new NotFoundException('Collaboration not found');
    }

    return result.rows[0];
  }

  async findByUserId(userId: string, role: UserRole) {
    const query =
      role === UserRole.BUYER
        ? 'SELECT * FROM collaborations WHERE buyer_id = ? ALLOW FILTERING'
        : 'SELECT * FROM collaborations WHERE seller_id = ? ALLOW FILTERING';

    const result = await this.cassandraService.execute(query, [userId], {
      prepare: true,
    });
    return result.rows;
  }

  async updateStatus(id: string, userId: string, status: CollaborationStatus) {
    const collaboration = await this.findById(id);

    if (collaboration.seller_id.toString() !== userId) {
      throw new ForbiddenException(
        'Only the seller can update the collaboration status',
      );
    }

    const query = 'UPDATE collaborations SET status = ? WHERE id = ?';
    await this.cassandraService.execute(query, [status, id], { prepare: true });

    return {
      ...collaboration,
      status,
    };
  }
}
