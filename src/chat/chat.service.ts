import { Injectable } from '@nestjs/common';
import { ChatMemberRepository } from 'src/chat_member/chat_member.repository';
import { UserRepository } from 'src/users/users.repository';
import { ChatRepository } from './ chat.repository';
import { ChatInterface, ChatNameDto } from './chat.entity';
import { ChatMemberService } from 'src/chat_member/chat_member.service';

@Injectable()
export class ChatService {
    constructor(private readonly repository: ChatRepository, 
                private readonly chatMemberService: ChatMemberService) {}

    async findUserChats() {
        // request in chat member to find all chat ids, and from this info get all chat names
        // request in chat repository to find all chats with id that we get from group member
    }

    async createSoloChat(chatName: ChatNameDto, admin) {
        const chatData: ChatInterface = {
            chat_name: chatName.chat_name,
            admin_id: admin.user_id
        }  
        const chat = await this.createChat(chatData)
        const chatMember = await this.chatMemberService.createChatMember(chat.chat_id, admin.user_id)
        return {
            chat,
            chatMember
        }
        // post request in chat repository to create chat with chat name, admin id is user that created this chat? or without admin
        // post request in chat member repository contact id for user that created chat from jwt token and new chat member from url? 
    }

    async createGroupChat() {
        // post request in chat repository to create chat with chat name, admin id is user that created this chat? or without admin
        // in body we need to get all the emails or ids that needs to add to chat if some user not have email, chat will be created to rest of the users 
        // same post request to create chat member
    }

    async createAdmin() {

    }

    async createChat(chatData : ChatInterface) {
        return this.repository.createChat(chatData)
    }

}
