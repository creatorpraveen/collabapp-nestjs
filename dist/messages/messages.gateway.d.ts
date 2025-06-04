import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import { SocketWithAuth } from './websocket.auth.middleware';
export declare class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    private readonly jwtService;
    server: Server;
    private readonly logger;
    constructor(messagesService: MessagesService, jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(client: SocketWithAuth): Promise<void>;
    handleDisconnect(client: SocketWithAuth): Promise<void>;
    handleJoinRoom(client: SocketWithAuth, data: {
        collaborationId: string;
    }): Promise<void>;
    handleLeaveRoom(client: SocketWithAuth, data: {
        collaborationId: string;
    }): Promise<void>;
    handleMessage(client: SocketWithAuth, data: {
        collaborationId: string;
        content: string;
        type: string;
    }): Promise<{
        collaborationId: string;
        messageId: string;
        senderId: string;
        content: string;
        type: string;
        timestamp: Date;
    }>;
}
