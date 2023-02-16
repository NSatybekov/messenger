import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserLoginInterface } from 'src/auth/dto';

@Injectable()
export class ChatMemberRepository {
    private readonly TABLE_NAME = 'chat_member'
    constructor(@InjectModel() private readonly db: Knex) {}
    
    async createChatMember(memberData, trx?) {
         const member  = await this.db.table(this.TABLE_NAME).insert(memberData)
                                                             .returning(['user_id', 'chat_id', 'joined_datetime', 'left_datetime'])
        return  member[0]
    }
}