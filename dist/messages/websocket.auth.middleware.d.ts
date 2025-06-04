import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
export type SocketWithAuth = Socket & {
    user: any;
};
export declare const WebSocketAuthMiddleware: (jwtService: JwtService) => (client: SocketWithAuth, next: (err?: Error) => void) => void;
