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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const cassandra_service_1 = require("../database/cassandra.service");
const cassandra_driver_1 = require("cassandra-driver");
let MessagesService = class MessagesService {
    cassandraService;
    constructor(cassandraService) {
        this.cassandraService = cassandraService;
    }
    async create(createMessageDto) {
        const messageId = cassandra_driver_1.types.TimeUuid.now();
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
    async findByCollaborationId(collaborationId, limit = 50) {
        const query = `
      SELECT * FROM messages
      WHERE collab_id = ?
      LIMIT ?
    `;
        const result = await this.cassandraService.execute(query, [collaborationId, limit], { prepare: true });
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
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cassandra_service_1.CassandraService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map