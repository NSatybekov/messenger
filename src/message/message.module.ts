import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { ChatMemberService } from 'src/chat_member/chat_member.service';
import { ChatModule } from 'src/chat/chat.module';
import { ChatMemberRepository } from 'src/chat_member/chat_member.repository';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from 'src/redis/redis.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { HandlerWelcomeMessage } from './welcome.handler';

@Module({
  providers: [
    MessageService,
    MessageRepository,
    ChatMemberRepository,
    ChatMemberService,
    EventEmitter2,
    RedisModule,
    KafkaModule,
    HandlerWelcomeMessage,
  ],
  controllers: [MessageController],
  imports: [ChatModule, EventEmitterModule.forRoot(), RedisModule, KafkaModule],
})
export class MessageModule {}
