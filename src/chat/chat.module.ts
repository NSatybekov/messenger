import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatRepository } from './ chat.repository';
import { UserRepository } from 'src/users/users.repository';
import { ChatMemberRepository } from 'src/chat_member/chat_member.repository';
import { ChatMemberService } from 'src/chat_member/chat_member.service';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'

@Module({
  providers: [ChatService, ChatRepository, UserRepository, ChatMemberRepository, ChatMemberService],
  controllers: [ChatController],
  imports: [EventEmitterModule.forRoot()]
})
export class ChatModule {}
