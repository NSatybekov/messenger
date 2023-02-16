import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserLoginInterface } from 'src/auth/dto';

@Injectable()
export class ChatRepository {
    private readonly TABLE_NAME = 'chat'
    constructor(@InjectModel() private readonly db: Knex) {}
    

    async createChat(data) {
        const chat = await this.db.table(this.TABLE_NAME)
                                  .insert(data)
                                  .returning(['chat_id', 'chat_name', 'admin_id'])
        
        return chat[0]
    }
}

    // create chat with chat id and admin is user that created if chat is group
    // add one member to chat

    // add multiple members to chat