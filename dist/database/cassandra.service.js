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
exports.CassandraService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cassandra_driver_1 = require("cassandra-driver");
let CassandraService = class CassandraService {
    configService;
    client;
    systemClient;
    constructor(configService) {
        this.configService = configService;
        this.systemClient = new cassandra_driver_1.Client({
            contactPoints: this.configService.get('cassandra.contactPoints'),
            localDataCenter: this.configService.get('cassandra.localDataCenter'),
            credentials: this.configService.get('cassandra.credentials'),
        });
        this.client = new cassandra_driver_1.Client({
            contactPoints: this.configService.get('cassandra.contactPoints'),
            localDataCenter: this.configService.get('cassandra.localDataCenter'),
            keyspace: this.configService.get('cassandra.keyspace'),
            credentials: this.configService.get('cassandra.credentials'),
        });
    }
    async onModuleInit() {
        await this.systemClient.connect();
        const keyspace = this.configService.get('cassandra.keyspace');
        await this.systemClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${keyspace}
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      }
    `);
        await this.systemClient.shutdown();
        await this.client.connect();
        await this.createTables();
    }
    async onModuleDestroy() {
        await this.client.shutdown();
    }
    async createTables() {
        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY,
        name text,
        email text,
        password text,
        role text
      )`,
            `CREATE INDEX IF NOT EXISTS users_email_idx ON users (email)`,
            `CREATE TABLE IF NOT EXISTS services (
        id uuid PRIMARY KEY,
        title text,
        description text,
        owner_id uuid
      )`,
            `CREATE TABLE IF NOT EXISTS collaborations (
        id uuid PRIMARY KEY,
        buyer_id uuid,
        seller_id uuid,
        service_id uuid,
        status text,
        created_at timestamp
      )`,
            `CREATE TABLE IF NOT EXISTS messages (
        collab_id uuid,
        message_id timeuuid,
        sender_id uuid,
        content text,
        type text,
        timestamp timestamp,
        PRIMARY KEY (collab_id, message_id)
      ) WITH CLUSTERING ORDER BY (message_id DESC)`,
        ];
        for (const query of queries) {
            await this.client.execute(query);
        }
    }
    async execute(query, params, options) {
        return this.client.execute(query, params, options);
    }
    get() {
        return this.client;
    }
};
exports.CassandraService = CassandraService;
exports.CassandraService = CassandraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CassandraService);
//# sourceMappingURL=cassandra.service.js.map