import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { UserRepository } from 'src/users/users.repository';
import { ChatMemberService } from 'src/chat_member/chat_member.service';
import { ChatModule } from 'src/chat/chat.module';
import { ChatMemberRepository } from 'src/chat_member/chat_member.repository';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'

@Module({
  providers: [MessageService, MessageRepository, ChatMemberRepository, ChatMemberService,  EventEmitter2],
  controllers: [MessageController],
  imports: [ChatModule, EventEmitterModule.forRoot()]
})
export class MessageModule {}
