import { HttpException, Injectable } from '@nestjs/common';
import { ChatMemberRepository } from './chat_member.repository';
import { ChatMemberCreateInterface, ChatMemberInterface, RoleEnum } from './chat_member.entity';
import { Knex } from 'knex';
import { UserInterface } from 'src/auth/dto';

@Injectable()
export class ChatMemberService {
    constructor(private readonly repository: ChatMemberRepository) {}


    async addMemberToChatAttempt(iniciator: UserInterface, chat_id: number, user_id: number, role: RoleEnum){
        const isAdmin = await this.isUserIsAdmin(iniciator.user_id, chat_id)
        if(isAdmin){
            return this.createChatMember(chat_id, user_id, role)
        }
        else{
            throw new HttpException('You are not admin', 400)
        }
    }

    async createChatMember(chat_id: number, user_id: number, role: RoleEnum){ // when im inserting type its conflicting
        try{
            const memberData = {
                chat_id, //im not adding role field by default its member role
                user_id,
                role
            };
            return this.repository.createChatMember(memberData);
        }
        catch{
            throw new HttpException('Cannot add user to chat', 400)
        }
    }

    async isUserIsAdmin(user_id: number, chat_id: number) {
        const role = await this.repository.getUserRole(user_id, chat_id)
        if(role === 'admin'){
            return true
        } else{
            return false
        }
    }

    async createStandartChatMembers(chat_id, firstUser_id, secondUser_id ) {
        const membersData: ChatMemberCreateInterface[] = [
            {
                chat_id: chat_id,
                user_id: firstUser_id,
                role: 'admin'
            },
            {
                chat_id: chat_id,
                user_id: secondUser_id,
                role: 'admin'
            },
        ]

        return this.createMultipleChatMembers(membersData)
    }

    async createMultipleChatMembers( membersData: ChatMemberCreateInterface[], trx?: Knex.Transaction) {
        return this.repository.createMultipleChatMembers(membersData, trx)
    }


    async updateUserRoleOrThrow(iniciator: UserInterface, chat_id: number, user_id: number, role: RoleEnum){
        const isAdmin = await this.isUserIsAdmin(iniciator.user_id, chat_id) // can add checking if user role is same as provided
        if(isAdmin){
            const status = await this.updateUserRole(chat_id, user_id, role)
            if(status){
                return 'User role have been updated'
            }else{
                throw new HttpException('Role wasa not updated', 400)
            }
        }
        else{
            throw new HttpException('You are not admin', 400)
        }
    }

    async updateUserRole(chat_id: number, user_id: number, role: RoleEnum) {
        return this.repository.updateRole(user_id, chat_id, role)
    }


    async getUserChats(user_id : number) {
        return this.repository.getUsersChats(user_id)
    }

    async getChatMembers(user, chat_id){
        const users = await this.repository.findChatMembers(chat_id)
        const userIds = users.map(user => user.user_id)
        if(userIds.includes(user.user_id)){
            return users
        } else{
            throw new HttpException('You have no rights', 400)
        }
    }

    async deleteChatMember(iniciator: UserInterface, chat_id: number, user_id: number) {
        const isAdmin = await this.isUserIsAdmin(iniciator.user_id, chat_id)
        if(isAdmin){
            const status = await this.repository.deleteChatMember(user_id, chat_id)
            if(status){
                return ' User have been deleted' 
            } else{
                throw new HttpException('User was not deleted', 400)
            }
        }
        else{
            throw new HttpException('You are not admin', 400)
        }
    }

    async isUserChatMember(user_id: number, chat_id: number): Promise<boolean>{
        const result = await this.repository.findUserFromChat(user_id, chat_id)
        if (result.length > 0) {
            return true
        }else return false
    }

}