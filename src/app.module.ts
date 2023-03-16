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
import { CommentsModule } from './comments/comments.module';
import { AlertsModule } from './alerts/alerts.module';
import { KafkaModule } from './kafka/kafka.module';
import { knexConfig} from './config/knex.config'

@Module({
  imports: [
    KnexModule.forRoot(knexConfig),
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
    CommentsModule,
    AlertsModule,
    KafkaModule,
  ], providers: [
    RedisModule
  ],
})
export class AppModule {}
