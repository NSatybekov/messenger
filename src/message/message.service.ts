import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { MessageDto, MessageInterface } from './message.entity';
import { UserRepository } from 'src/users/users.repository';


@Injectable()
export class MessageService {
    constructor(private messageRepository: MessageRepository, private readonly userRepository: UserRepository) {}

    async sendMessage(user: UserInterface, message: MessageDto, chat_id?) { 
        const messageData: MessageInterface = {
            text: message.text,
            user_id: user.user_id,
            chat_id: chat_id
        }
        const result = await this.messageRepository.createMessage(messageData)
        return result
    }
}
