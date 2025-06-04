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
exports.CollaborationsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const cassandra_service_1 = require("../database/cassandra.service");
const collaboration_status_enum_1 = require("./collaboration-status.enum");
const create_user_dto_1 = require("../users/dto/create-user.dto");
let CollaborationsService = class CollaborationsService {
    cassandraService;
    constructor(cassandraService) {
        this.cassandraService = cassandraService;
    }
    async create(createCollaborationDto, buyerId) {
        const collaborationId = (0, uuid_1.v4)();
        const query = `
      INSERT INTO collaborations (
        id, buyer_id, seller_id, service_id, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
        const params = [
            collaborationId,
            buyerId,
            createCollaborationDto.sellerId,
            createCollaborationDto.serviceId,
            collaboration_status_enum_1.CollaborationStatus.PENDING,
            new Date(),
        ];
        await this.cassandraService.execute(query, params, { prepare: true });
        return {
            id: collaborationId,
            buyerId,
            sellerId: createCollaborationDto.sellerId,
            serviceId: createCollaborationDto.serviceId,
            status: collaboration_status_enum_1.CollaborationStatus.PENDING,
            createdAt: new Date(),
        };
    }
    async findById(id) {
        const query = 'SELECT * FROM collaborations WHERE id = ?';
        const result = await this.cassandraService.execute(query, [id], {
            prepare: true,
        });
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('Collaboration not found');
        }
        return result.rows[0];
    }
    async findByUserId(userId, role) {
        const query = role === create_user_dto_1.UserRole.BUYER
            ? 'SELECT * FROM collaborations WHERE buyer_id = ? ALLOW FILTERING'
            : 'SELECT * FROM collaborations WHERE seller_id = ? ALLOW FILTERING';
        const result = await this.cassandraService.execute(query, [userId], {
            prepare: true,
        });
        return result.rows;
    }
    async updateStatus(id, userId, status) {
        const collaboration = await this.findById(id);
        if (collaboration.seller_id.toString() !== userId) {
            throw new common_1.ForbiddenException('Only the seller can update the collaboration status');
        }
        const query = 'UPDATE collaborations SET status = ? WHERE id = ?';
        await this.cassandraService.execute(query, [status, id], { prepare: true });
        return {
            ...collaboration,
            status,
        };
    }
};
exports.CollaborationsService = CollaborationsService;
exports.CollaborationsService = CollaborationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cassandra_service_1.CassandraService])
], CollaborationsService);
//# sourceMappingURL=collaborations.service.js.map