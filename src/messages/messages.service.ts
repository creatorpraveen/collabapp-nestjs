import { Injectable } from '@nestjs/common';
import { CassandraService } from '../database/cassandra.service';
import { types } from 'cassandra-driver';

interface CreateMessageDto {
  collaborationId: string;
  senderId: string;
  content: string;
  type: string;
}

@Injectable()
export class MessagesService {
  constructor(private cassandraService: CassandraService) {}

  async create(createMessageDto: CreateMessageDto) {
    const messageId = types.TimeUuid.now();
    const timestamp = new Date();

    const query = `
      INSERT INTO messages (
        collab_id, message_id, sender_id, content, type, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      createMessageDto.collaborationId,
      messageId,
      createMessageDto.senderId,
      createMessageDto.content,
      createMessageDto.type,
      timestamp,
    ];

    await this.cassandraService.execute(query, params, { prepare: true });

    return {
      collaborationId: createMessageDto.collaborationId,
      messageId: messageId.toString(),
      senderId: createMessageDto.senderId,
      content: createMessageDto.content,
      type: createMessageDto.type,
      timestamp,
    };
  }

  async findByCollaborationId(collaborationId: string, limit = 50) {
    const query = `
      SELECT * FROM messages
      WHERE collab_id = ?
      LIMIT ?
    `;
    const result = await this.cassandraService.execute(
      query,
      [collaborationId, limit],
      { prepare: true },
    );

    return result.rows.map((row) => ({
      collab_id: row.collab_id,
      message_id: row.message_id.toString(),
      content: row.content,
      sender_id: row.sender_id ? row.sender_id.toString() : null,
      timestamp: row.timestamp,
      type: row.type,
      messageId: row.message_id.toString(),
    }));
  }
}
