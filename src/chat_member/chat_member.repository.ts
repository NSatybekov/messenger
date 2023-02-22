import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { ChatMemberInterface,ChatMemberCreateInterface } from './chat_member.entity';

@Injectable()
export class ChatMemberRepository {
    private readonly TABLE_NAME = 'chat_member'
    constructor(@InjectModel() private readonly db: Knex) {} 
    
    async createChatMember(memberData: ChatMemberCreateInterface): Promise<ChatMemberInterface> {
         const member  = await this.db.table(this.TABLE_NAME).insert(memberData)
                                                             .returning(['user_id', 'chat_id', 'created_at', 'left_at', 'role'])
        return  member[0]
    }

    async createMultipleChatMembers(membersData: ChatMemberCreateInterface[], trx?: Knex.Transaction): Promise<ChatMemberInterface[]> {
        const members = await (trx || this.db).table(this.TABLE_NAME).insert(membersData).returning(['user_id', 'chat_id', 'created_at', 'left_at', 'role'])
        return members
    }

    async getUsersChats(user_id: number) {
        const chats = await this.db.select('chat_id').table(this.TABLE_NAME).where('user_id', user_id)
        return chats
    }

    async findChatMembers(chat_id: number): Promise<ChatMemberInterface[]> {
        const users = await this.db.select('*').table(this.TABLE_NAME).where('chat_id', chat_id)
        return users
    }

    async deleteChatMember(user_id: number, chat_id:number): Promise<boolean> {
        const result = await this.db.table(this.TABLE_NAME).where({user_id, chat_id}).update({left_at: new Date()})

        if (result > 0) {  
            return true;  
        } else {
            return false;
        }
    }

    async updateRole(user_id: number, chat_id: number, newRole: string): Promise<boolean> {
        const result = await this.db.table(this.TABLE_NAME)
          .where({ user_id, chat_id}) 
          .update({ role: newRole });
      
          if (result > 0) {  
            return true; 
        } else {
            return false;
        }
      }

      async getUserRole(user_id: number, chat_id: number): Promise<string>{
        const result = await this.db.select('role').table(this.TABLE_NAME).where({user_id, chat_id})
        return result[0].role
      }

      async isUserChatMember(user_id: number, chat_id: number) {
        const result = await this.db.table(this.TABLE_NAME).where({user_id, chat_id})
        return result
      }


}