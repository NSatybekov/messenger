import { Injectable } from '@nestjs/common';
import { ChatMemberRepository } from './chat_member.repository';

@Injectable()
export class ChatMemberService {
    constructor(private readonly chatMemberRepository: ChatMemberRepository) {}

    async createChatMember(chat_id, user_id, trx?: any) {
        const memberData = {
            chat_id: chat_id,
            user_id: user_id,
        };
        return this.chatMemberRepository.createChatMember(memberData, trx);
    }
}