import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    createMessage(createMessageDto: CreateMessageDto, req: any): Promise<{
        collaborationId: string;
        messageId: string;
        senderId: string;
        content: string;
        type: string;
        timestamp: Date;
    }>;
    getCollaborationMessages(collaborationId: string, req: any): Promise<{
        collab_id: any;
        message_id: any;
        content: any;
        sender_id: any;
        timestamp: any;
        type: any;
        messageId: any;
    }[]>;
}
