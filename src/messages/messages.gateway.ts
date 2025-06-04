import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import {
  WebSocketAuthMiddleware,
  SocketWithAuth,
} from './websocket.auth.middleware';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: true,
  namespace: '/chat',
  transports: ['websocket'],
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
    const middleware = WebSocketAuthMiddleware(this.jwtService);
    server.use(middleware);
  }

  async handleConnection(client: SocketWithAuth) {
    try {
      this.logger.log(`Client trying to connect: ${client.id}`);
      // Client is already authenticated through middleware
      this.logger.log(
        `Client connected: ${client.id}, User: ${client.user?.sub}`,
      );
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: SocketWithAuth) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() data: { collaborationId: string },
  ) {
    this.logger.log(`Client ${client.id} joining room ${data.collaborationId}`);
    client.join(data.collaborationId);
    this.server.to(data.collaborationId).emit('userJoined', {
      userId: client.user.sub,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() data: { collaborationId: string },
  ) {
    this.logger.log(`Client ${client.id} leaving room ${data.collaborationId}`);
    client.leave(data.collaborationId);
    this.server.to(data.collaborationId).emit('userLeft', {
      userId: client.user.sub,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody()
    data: { collaborationId: string; content: string; type: string },
  ) {
    this.logger.log(
      `Client ${client.id} sending message to room ${data.collaborationId}`,
    );
    const message = await this.messagesService.create({
      collaborationId: data.collaborationId,
      senderId: client.user.sub,
      content: data.content,
      type: data.type,
    });

    this.server.to(data.collaborationId).emit('newMessage', message);
    return message;
  }
}
