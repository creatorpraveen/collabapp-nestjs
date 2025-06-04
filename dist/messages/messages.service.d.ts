import { CassandraService } from '../database/cassandra.service';
interface CreateMessageDto {
    collaborationId: string;
    senderId: string;
    content: string;
    type: string;
}
export declare class MessagesService {
    private cassandraService;
    constructor(cassandraService: CassandraService);
    create(createMessageDto: CreateMessageDto): Promise<{
        collaborationId: string;
        messageId: string;
        senderId: string;
        content: string;
        type: string;
        timestamp: Date;
    }>;
    findByCollaborationId(collaborationId: string, limit?: number): Promise<{
        collab_id: any;
        message_id: any;
        content: any;
        sender_id: any;
        timestamp: any;
        type: any;
        messageId: any;
    }[]>;
}
export {};
