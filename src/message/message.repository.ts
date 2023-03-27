import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { MessageCreateInterface, MessageInterface } from './message.entity';

@Injectable()
export class MessageRepository {
  private readonly TABLE_NAME = 'message';
  constructor(@InjectModel() private readonly db: Knex) {}

  async createMessage(
    messageData: MessageCreateInterface,
  ): Promise<MessageInterface> {
    const message = await this.db
      .table(this.TABLE_NAME)
      .insert(messageData)
      .returning(['message_id', 'user_id', 'text', 'created_at', 'chat_id']);
    return message[0];
  }

  async findMessageById(message_id: number): Promise<MessageInterface> {
    const message = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ message_id });
    return message[0];
  }

  async findUserMessages(user_id: number): Promise<MessageInterface[]> {
    const messages = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ user_id });
    return messages;
  }

  async findUserMessagesInChat(
    user_id: number,
    chat_id: number,
  ): Promise<MessageInterface[]> {
    const messages = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ user_id, chat_id });
    return messages;
  }

  async findChatMessages(chat_id: number): Promise<MessageInterface[]> {
    const messages = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ chat_id });
    return messages;
  }

  async deleteMessage(message_id: number): Promise<boolean> {
    const result = await this.db
      .table(this.TABLE_NAME)
      .where({ message_id })
      .delete();
    return result > 0 ? true : false;
  }

  async isUserMessageAuthor(user_id, message_id): Promise<boolean> {
    const result = await this.db
      .table(this.TABLE_NAME)
      .where({ message_id, user_id });
    return result.length > 0 ? true : false;
  }

  async updateMessage(message_id, messageText): Promise<boolean> {
    const result = await this.db
      .table(this.TABLE_NAME)
      .where({ message_id })
      .update({ text: messageText });
    return result > 0 ? true : false;
  }
}
