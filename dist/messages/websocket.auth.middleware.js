"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketAuthMiddleware = void 0;
const websockets_1 = require("@nestjs/websockets");
const WebSocketAuthMiddleware = (jwtService) => {
    return (client, next) => {
        try {
            const token = client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new websockets_1.WsException('Unauthorized');
            }
            const payload = jwtService.verify(token);
            client.user = payload;
            next();
        }
        catch (error) {
            next(new websockets_1.WsException('Unauthorized'));
        }
    };
};
exports.WebSocketAuthMiddleware = WebSocketAuthMiddleware;
//# sourceMappingURL=websocket.auth.middleware.js.map