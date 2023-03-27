import { Module } from '@nestjs/common';
import { ChatMemberService } from './chat_member.service';
import { ChatMemberController } from './chat_member.controller';
import { ChatMemberRepository } from './chat_member.repository';

@Module({
  providers: [ChatMemberService, ChatMemberRepository],
  controllers: [ChatMemberController],
  exports: [ChatMemberService],
})
export class ChatMemberModule {}
