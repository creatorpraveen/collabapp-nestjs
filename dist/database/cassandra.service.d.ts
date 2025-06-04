import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, QueryOptions } from 'cassandra-driver';
export declare class CassandraService implements OnModuleInit, OnModuleDestroy {
    private configService;
    private client;
    private systemClient;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private createTables;
    execute(query: string, params?: any[], options?: QueryOptions): Promise<import("cassandra-driver").types.ResultSet>;
    get(): Client;
}
