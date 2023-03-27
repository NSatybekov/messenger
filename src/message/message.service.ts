import { HttpException, Injectable, Inject } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { UserInterface } from 'src/auth/dto';
import {
  MessageDto,
  MessageCreateInterface,
  MessageInterface,
  UpdateMessageDto,
} from './message.entity';
import { ChatMemberService } from 'src/chat_member/chat_member.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Redis } from 'ioredis';
import { ProducerService } from 'src/kafka/producer.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Injectable()
export class MessageService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private repository: MessageRepository,
    private readonly chatMemberService: ChatMemberService,
    private readonly eventEmitter: EventEmitter2,
    private readonly kafkaProduce: ProducerService,
    private readonly consumerService: ConsumerService,
  ) {}

  async sendMessage(user: UserInterface, message: MessageDto, chat_id: number) {
    const memberStatus = await this.chatMemberService.isUserChatMember(
      user.user_id,
      chat_id,
    );
    if (memberStatus) {
      const messageData: MessageCreateInterface = {
        text: `${message.text} (${process.pid})`,
        user_id: user.user_id,
        chat_id: chat_id,
      };
      const result = await this.createMessage(messageData);
      await this.sendMessageToKafka(messageData.text, user.user_id);
      this.redisClient.publish(`newMessage_${chat_id}`, JSON.stringify(result));
      return result;
    } else {
      throw new HttpException('You have no rights', 400);
    }
  }

  async createMessage(messageData: MessageCreateInterface) {
    //this needs to emit event and send it with sse
    const result = await this.repository.createMessage(messageData);
    const chat_id = messageData.chat_id;
    const cachedMessages = await this.redisClient.get(`chat:${chat_id}`);
    if (cachedMessages) {
      // this needs to solve bug, when i get data from DB it returned old cache and it was bugged ITS SHIT I cant add message because each key is array, so
      const messages = JSON.parse(cachedMessages); // i need to save every message and after this make scan - what is tradeoff?
      messages.push(result);
      await this.redisClient.set(`chat:${chat_id}`, JSON.stringify(messages));
    }
    return result;
  }

  async sendMessageToKafka(text: string, userId) {
    const idString = await userId.toString();
    this.kafkaProduce.produce({
      topic: 'Created_message',
      messages: [{ key: idString, value: text }],
    });
  }

  async findUserMessagesInChat(user: UserInterface, chat_id: number) {
    return this.repository.findUserMessagesInChat(user.user_id, chat_id);
  }

  async findAllMessagesInChat(
    user: UserInterface,
    chat_id: number,
  ): Promise<MessageInterface[] | string> {
    const memberStatus = await this.chatMemberService.isUserChatMember(
      user.user_id,
      chat_id,
    );
    if (memberStatus) {
      const cachedMessages = await this.redisClient.get(`chat:${chat_id}`);
      if (cachedMessages) {
        console.log('From cache');
        return JSON.parse(cachedMessages);
      } else {
        const messages = await this.repository.findChatMessages(chat_id);
        await this.redisClient.set(`chat:${chat_id}`, JSON.stringify(messages));
        console.log('From DB');
        return messages; // сделать чтобы айди сообщения и оно инкрементальное когда вытащу сообщения и отсортирую
      } // композитный ключ sorted set -ZADD
    } else {
      return 'Not your chat';
    }
  }

  async updateMessageTry(
    user: UserInterface,
    message_id: number,
    messageData: UpdateMessageDto,
  ) {
    const isAuthor = await this.isUserMessageAuthor(user, message_id);
    if (isAuthor) {
      const result = await this.updateMessage(message_id, messageData.text);
      if (result) {
        return this.findMessageById(message_id);
      } else {
        throw new HttpException('Not updated', 404);
      }
    } else {
      throw new HttpException('You are not message author', 404);
    }
  }

  async deleteMessageTry(user: UserInterface, message_id: number) {
    const isAuthor = await this.isUserMessageAuthor(user, message_id);
    if (isAuthor) {
      const result = await this.deleteMessage(message_id);
      if (result) {
        return 'Message deleted';
      } else {
        throw new HttpException('Not deleted', 404);
      }
    } else {
      throw new HttpException('You are not message author', 404);
    }
  }

  async deleteMessage(message_id: number) {
    return await this.repository.deleteMessage(message_id);
  }

  async updateMessage(message_id: number, messageText: string) {
    return await this.repository.updateMessage(message_id, messageText);
  }

  async isUserMessageAuthor(user, message_id) {
    return await this.repository.isUserMessageAuthor(user.user_id, message_id);
  }

  async findUserMessages(user: UserInterface): Promise<MessageInterface[]> {
    return await this.repository.findUserMessages(user.user_id);
  }

  async findMessageById(message_id: number) {
    return await this.repository.findMessageById(message_id);
  }
}
