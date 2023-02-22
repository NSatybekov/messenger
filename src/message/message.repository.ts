import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserLoginInterface } from 'src/auth/dto';
import { MessageInterface } from './message.entity';

@Injectable()
export class MessageRepository  {
    private readonly TABLE_NAME = 'message'
    constructor(@InjectModel() private readonly db: Knex) {}

    async createMessage(messageData : MessageInterface) {
        const message = await this.db.table(this.TABLE_NAME).insert(messageData)
                                                            .returning(['message_id', 'user_id', 'text', 'created_at', 'chat_id'])
        return message[0]
    }

    async findMessageById(){

    }

    async findUserMessages(){ 

    }

    async findUserMessagesInChat(){
        
    }

    async findChatMessages(){

    
    }

    async editMessage(){

    }

    async deleteMessage(){

    }

}