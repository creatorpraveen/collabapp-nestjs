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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const cassandra_service_1 = require("../database/cassandra.service");
let ServicesService = class ServicesService {
    cassandraService;
    constructor(cassandraService) {
        this.cassandraService = cassandraService;
    }
    async create(createServiceDto, ownerId) {
        const serviceId = (0, uuid_1.v4)();
        const query = 'INSERT INTO services (id, title, description, owner_id) VALUES (?, ?, ?, ?)';
        const params = [
            serviceId,
            createServiceDto.title,
            createServiceDto.description,
            ownerId,
        ];
        await this.cassandraService.execute(query, params, { prepare: true });
        return {
            id: serviceId,
            ...createServiceDto,
            ownerId,
        };
    }
    async findById(id) {
        const query = 'SELECT * FROM services WHERE id = ?';
        const result = await this.cassandraService.execute(query, [id], {
            prepare: true,
        });
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('Service not found');
        }
        return result.rows[0];
    }
    async findByOwnerId(ownerId) {
        const query = 'SELECT * FROM services WHERE owner_id = ? ALLOW FILTERING';
        const result = await this.cassandraService.execute(query, [ownerId], {
            prepare: true,
        });
        return result.rows;
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cassandra_service_1.CassandraService])
], ServicesService);
//# sourceMappingURL=services.service.js.map