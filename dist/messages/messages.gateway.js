"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MessagesGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const messages_service_1 = require("./messages.service");
const websocket_auth_middleware_1 = require("./websocket.auth.middleware");
const common_1 = require("@nestjs/common");
let MessagesGateway = MessagesGateway_1 = class MessagesGateway {
    messagesService;
    jwtService;
    server;
    logger = new common_1.Logger(MessagesGateway_1.name);
    constructor(messagesService, jwtService) {
        this.messagesService = messagesService;
        this.jwtService = jwtService;
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway initialized');
        const middleware = (0, websocket_auth_middleware_1.WebSocketAuthMiddleware)(this.jwtService);
        server.use(middleware);
    }
    async handleConnection(client) {
        try {
            this.logger.log(`Client trying to connect: ${client.id}`);
            this.logger.log(`Client connected: ${client.id}, User: ${client.user?.sub}`);
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleJoinRoom(client, data) {
        this.logger.log(`Client ${client.id} joining room ${data.collaborationId}`);
        client.join(data.collaborationId);
        this.server.to(data.collaborationId).emit('userJoined', {
            userId: client.user.sub,
            timestamp: new Date(),
        });
    }
    async handleLeaveRoom(client, data) {
        this.logger.log(`Client ${client.id} leaving room ${data.collaborationId}`);
        client.leave(data.collaborationId);
        this.server.to(data.collaborationId).emit('userLeft', {
            userId: client.user.sub,
            timestamp: new Date(),
        });
    }
    async handleMessage(client, data) {
        this.logger.log(`Client ${client.id} sending message to room ${data.collaborationId}`);
        const message = await this.messagesService.create({
            collaborationId: data.collaborationId,
            senderId: client.user.sub,
            content: data.content,
            type: data.type,
        });
        this.server.to(data.collaborationId).emit('newMessage', message);
        return message;
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessagesGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMessage", null);
exports.MessagesGateway = MessagesGateway = MessagesGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
        namespace: '/chat',
        transports: ['websocket'],
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        jwt_1.JwtService])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map