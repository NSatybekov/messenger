import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserLoginInterface } from 'src/auth/dto';
import { ChatInterface, ChatRegistryInterface } from './chat.entity';

@Injectable()
export class ChatRepository {
    private readonly TABLE_NAME = 'chat'
    constructor(@InjectModel() private readonly db: Knex) {}
    

    async createChat(data: ChatRegistryInterface, trx?: Knex.Transaction){
        const chat = await (trx || this.db).table(this.TABLE_NAME)
                                  .insert(data)
                                  .returning(['chat_id', 'name'])
        
        return chat[0]
    }
 
    async findChatById(id: number | number[]) {
        const chat = await this.db.table(this.TABLE_NAME)
                                  .whereIn('chat_id', Array.isArray(id) ? id : [id]) //method checks if its array of ids to make it more flexible
        return chat

    }

    async findChantByName(name: string) {
        const chat = await this.db.table(this.TABLE_NAME).where('name', name)
        return chat[0]
    }

    async getChatName(id: number) { // made another method to directly find name from table its faster than making it in my code
        const chat = await this.db
                               .select('name')
                               .from(this.TABLE_NAME)
                               .where('chat_id', id)
        return chat
    }

    getTransaction() {
        return this.db.transaction();
      }
}
