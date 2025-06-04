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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const bcrypt = require("bcrypt");
const cassandra_service_1 = require("../database/cassandra.service");
let UsersService = class UsersService {
    cassandraService;
    constructor(cassandraService) {
        this.cassandraService = cassandraService;
    }
    async create(createUserDto) {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const userId = (0, uuid_1.v4)();
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const query = 'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)';
        const params = [
            userId,
            createUserDto.name,
            createUserDto.email.toLowerCase(),
            hashedPassword,
            createUserDto.role,
        ];
        await this.cassandraService.execute(query, params, { prepare: true });
        return {
            id: userId,
            name: createUserDto.name,
            email: createUserDto.email,
            role: createUserDto.role,
        };
    }
    async findByEmail(email) {
        if (!email) {
            return null;
        }
        const query = 'SELECT * FROM users WHERE email = ?';
        const result = await this.cassandraService.execute(query, [email.toLowerCase()], { prepare: true });
        return result.rows[0];
    }
    async findById(id) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const result = await this.cassandraService.execute(query, [id], {
            prepare: true,
        });
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('User not found');
        }
        return result.rows[0];
    }
    async validatePassword(user, password) {
        return bcrypt.compare(password, user.password);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cassandra_service_1.CassandraService])
], UsersService);
//# sourceMappingURL=users.service.js.map