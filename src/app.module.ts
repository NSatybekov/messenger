import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import {KnexModule} from 'nest-knexjs'
import { Knex } from 'knex';
import { UsersModule } from './users/users.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ChatMemberModule } from './chat_member/chat_member.module';
import { RedisModule } from './redis/redis.module';
import { Redis } from 'ioredis'
import { FriendsModule } from './friends/friends.module';
import { PostsModule } from './posts/posts.module';


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
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MessageModule,
    ChatModule,
    ChatMemberModule,
    SwaggerModule,
    FriendsModule,
    PostsModule,
  ], providers: [
    RedisModule
  ],
})
export class AppModule {}
