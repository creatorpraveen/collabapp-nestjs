import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { CollaborationsModule } from './collaborations/collaborations.module';
import { MessagesModule } from './messages/messages.module';
import cassandraConfig from './config/cassandra.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [cassandraConfig],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    CollaborationsModule,
    MessagesModule,
  ],
})
export class AppModule {}
