import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

export type SocketWithAuth = Socket & { user: any };

export const WebSocketAuthMiddleware = (jwtService: JwtService) => {
  return (client: SocketWithAuth, next: (err?: Error) => void) => {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new WsException('Unauthorized');
      }

      const payload = jwtService.verify(token);
      client.user = payload;
      next();
    } catch (error) {
      next(new WsException('Unauthorized'));
    }
  };
};
