import { HttpException, Injectable } from '@nestjs/common';
import { ChatMemberRepository } from 'src/chat_member/chat_member.repository';
import { UserRepository } from 'src/users/users.repository';
import { ChatRepository } from './ chat.repository';
import { ChatInterface, ChatNameDto, ChatRegistryInterface } from './chat.entity';
import { ChatMemberService } from 'src/chat_member/chat_member.service';
import { UserInterface } from 'src/auth/dto';
import { ChatMemberCreateInterface, ChatMemberInterface } from '../chat_member/chat_member.entity';
import { Knex } from 'knex';


@Injectable()
export class ChatService {
    constructor(private readonly repository: ChatRepository, 
                private readonly chatMemberService: ChatMemberService) {}

    async findUserChats(user) {
        const chatsInfo = await this.chatMemberService.getUserChats(user.user_id)
        const chatIdArray = chatsInfo.map(chat => chat.chat_id)
        return this.repository.findChatById(chatIdArray)
    }

    async createStandartChat(chatName: ChatNameDto, user, secondUserId) {
        try{
            const chatData: ChatRegistryInterface = {
                name: chatName.name
            }  
            const chat = await this.createChat(chatData)
            const chatMembers = await this.chatMemberService.createStandartChatMembers(chat.chat_id, user.user_id, secondUserId)
            return {
                chat,
                chatMembers
            }
        } catch{
            throw new HttpException('User not found try another one', 400)
        }
    }

    async createGroupChat(author: UserInterface, chatName: string, users: string[]) {
        const trx = await this.repository.getTransaction()
        try{
            const chatData: ChatRegistryInterface = {name: chatName}  
            const chat = await this.createChat(chatData, trx)
                const userIds = users.map(userId => parseInt(userId))
                    const usersData: ChatMemberCreateInterface[] = [
                        {
                            chat_id: chat.chat_id,
                            user_id: author.user_id,
                            role: 'admin' as const
                        },
                            ...userIds.map((userId) => ({ 
                            chat_id: chat.chat_id,
                            user_id: userId,
                            role: 'member' as const, // as const needs to tell typescript use it as member if i will not use it there will be error, because it compile its to string by default
                            }))
                            ]
                                    const chatMembers = await this.chatMemberService.createMultipleChatMembers(usersData, trx)
                                        await trx.commit()
                                        return chatMembers
            } catch(error){
                    await trx.rollback()
                        throw new HttpException(error, 400)
            }
    }

    async createChat(chatData : ChatRegistryInterface, trx?: Knex.Transaction) {
        return this.repository.createChat(chatData, trx)
    }

    async findChatById(id: number) {
        try{
            return this.repository.findChatById(id)
        } catch{
            throw new HttpException('Error - chat not found try another id', 400)
        }
    }

    async findChatByName(name: string) {
        try{
            return this.repository.findChantByName(name)
        } catch{
            throw new HttpException('Error - chat not found try another name', 400)
        }
    }

}
