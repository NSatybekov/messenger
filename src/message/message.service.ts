import { HttpException, Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { MessageDto, MessageCreateInterface, MessageInterface } from './message.entity';
import { UserRepository } from 'src/users/users.repository';
import { ChatMemberService } from 'src/chat_member/chat_member.service';
import { EventEmitter2 } from '@nestjs/event-emitter'


@Injectable()
export class MessageService {
    constructor(private repository: MessageRepository, 
        private readonly chatMemberService: ChatMemberService,
        private readonly eventEmitter: EventEmitter2
        ) {}

    async sendMessage(user: UserInterface, message: MessageDto, chat_id: number) { 
        const memberStatus = await this.chatMemberService.isUserChatMember(user.user_id, chat_id)
        if(memberStatus){
            const messageData: MessageCreateInterface = {
                text: `${message.text} (${process.pid})`,
                user_id: user.user_id,
                chat_id: chat_id
            }
            const result = await this.createMessage(messageData)
            this.eventEmitter.emit(`newMessage_${chat_id}`, {message: result})
            return result
        }
        else{
            throw new HttpException('You have no rights', 400)
        }
    }

    async createMessage(messageData: MessageCreateInterface){ //this needs to emit event and send it with sse 
        const result = await this.repository.createMessage(messageData)
        return result
    }

    async findUserMessagesInChat(user: UserInterface, chat_id: number){
        return this.repository.findUserMessagesInChat(user.user_id, chat_id)
    }

    async findAllMessagesInChat(user: UserInterface, chat_id: number){
        const memberStatus = await this.chatMemberService.isUserChatMember(user.user_id, chat_id)
        if(memberStatus){
            return this.repository.findChatMessages( chat_id)
        } else{
            return 'Not your chat'
        }
    }

}
