import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, QueryOptions } from 'cassandra-driver';

@Injectable()
export class CassandraService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private systemClient: Client;

  constructor(private configService: ConfigService) {
    // Create a client for system operations (without keyspace)
    this.systemClient = new Client({
      contactPoints: this.configService.get('cassandra.contactPoints'),
      localDataCenter: this.configService.get('cassandra.localDataCenter'),
      credentials: this.configService.get('cassandra.credentials'),
    });

    // Create the main client (with keyspace)
    this.client = new Client({
      contactPoints: this.configService.get('cassandra.contactPoints'),
      localDataCenter: this.configService.get('cassandra.localDataCenter'),
      keyspace: this.configService.get('cassandra.keyspace'),
      credentials: this.configService.get('cassandra.credentials'),
    });
  }

  async onModuleInit() {
    // Connect to system first
    await this.systemClient.connect();

    // Create keyspace if not exists
    const keyspace = this.configService.get('cassandra.keyspace');
    await this.systemClient.execute(`
      CREATE KEYSPACE IF NOT EXISTS ${keyspace}
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      }
    `);

    // Disconnect from system client
    await this.systemClient.shutdown();

    // Connect to the main client (with keyspace)
    await this.client.connect();

    // Create tables
    await this.createTables();
  }

  async onModuleDestroy() {
    await this.client.shutdown();
  }

  private async createTables() {
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

  async execute(query: string, params?: any[], options?: QueryOptions) {
    return this.client.execute(query, params, options);
  }

  get(): Client {
    return this.client;
  }
}
