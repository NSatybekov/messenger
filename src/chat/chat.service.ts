import { HttpException, Injectable } from '@nestjs/common';
import { ChatRepository } from './ chat.repository';
import {
  ChatInterface,
  ChatNameDto,
  ChatRegistryInterface,
} from './chat.entity';
import { ChatMemberService } from 'src/chat_member/chat_member.service';
import { UserInterface } from 'src/auth/dto';
import { ChatMemberCreateInterface } from '../chat_member/chat_member.entity';
import { Knex } from 'knex';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly repository: ChatRepository,
    private readonly chatMemberService: ChatMemberService,
    private readonly kafkaProduce: ProducerService,
  ) {}

  async findUserChats(user) {
    const chatsInfo = await this.chatMemberService.getUserChats(user.user_id);
    const chatIdArray = chatsInfo.map((chat) => chat.chat_id);
    return this.repository.findChatById(chatIdArray);
  }

  async createStandartChat(chatName: ChatNameDto, user, secondUserId) {
    try {
      const chatData: ChatRegistryInterface = {
        name: chatName.name,
      };
      const chat = await this.createChat(chatData);
      const chatMembers =
        await this.chatMemberService.createStandartChatMembers(
          chat.chat_id,
          user.user_id,
          secondUserId,
        );
      await this.createChatKakfa(chat.chat_id, user.user_id, chat.name);
      return {
        chat,
        chatMembers,
      };
    } catch {
      throw new HttpException('User not found try another one', 400);
    }
  }

  async createChatKakfa(chatId: number, userId: number, chatName: string) {
    const messageValue = JSON.stringify({ chatName: chatName, userId: userId });
    const chatIdString = chatId.toString();
    this.kafkaProduce.produce({
      topic: 'chat_created',
      messages: [{ key: chatIdString, value: messageValue }],
    });
  }

  async createGroupChat(
    author: UserInterface,
    chatName: string,
    users: string[],
  ) {
    const trx = await this.repository.getTransaction();
    try {
      const chatData: ChatRegistryInterface = { name: chatName };
      const chat = await this.createChat(chatData, trx);
      const userIds = users.map((userId) => parseInt(userId));
      const usersData: ChatMemberCreateInterface[] = [
        {
          chat_id: chat.chat_id,
          user_id: author.user_id,
          role: 'admin' as const,
        },
        ...userIds.map((userId) => ({
          chat_id: chat.chat_id,
          user_id: userId,
          role: 'member' as const, // as const needs to tell typescript use it as member if i will not use it there will be error, because it compile its to string by default
        })),
      ];
      const chatMembers =
        await this.chatMemberService.createMultipleChatMembers(usersData, trx);
      await trx.commit();
      return chatMembers;
    } catch (error) {
      await trx.rollback();
      throw new HttpException(error, 400);
    }
  }

  async createChat(
    chatData: ChatRegistryInterface,
    trx?: Knex.Transaction,
  ): Promise<ChatInterface> {
    return this.repository.createChat(chatData, trx);
  }

  async findChatById(id: number) {
    try {
      return this.repository.findChatById(id);
    } catch {
      throw new HttpException('Error - chat not found try another id', 400);
    }
  }

  async findChatByName(name: string) {
    try {
      return this.repository.findChantByName(name);
    } catch {
      throw new HttpException('Error - chat not found try another name', 400);
    }
  }
}
