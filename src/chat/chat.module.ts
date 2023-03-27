import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './ chat.repository';
import { UserRepository } from 'src/users/users.repository';
import { ChatMemberRepository } from 'src/chat_member/chat_member.repository';
import { ChatMemberService } from 'src/chat_member/chat_member.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  providers: [
    ChatService,
    ChatRepository,
    UserRepository,
    ChatMemberRepository,
    ChatMemberService,
    KafkaModule,
  ],
  controllers: [ChatController],
  imports: [EventEmitterModule.forRoot(), KafkaModule],
})
export class ChatModule {}
