import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import {KnexModule} from 'nest-knexjs'
import { Knex } from 'knex';
import { UsersModule } from './users/users.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { ChatMemberModule } from './chat_member/chat_member.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'pg',
        version: '13',
        useNullAsDefault: true,
        connection: { 
          host: '127.0.0.1',
          user: 'postgres',
          password: '123',
          database: 'nest',
          port: 5434
        }
      }
    }),
    AuthModule, 
    PrismaModule, 
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MessageModule,
    ChatModule,
    ChatMemberModule,
  ]
})
export class AppModule {}
