import { Controller, Injectable, OnModuleInit } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MessageService } from './message.service';
import { ConsumerService } from 'src/kafka/consumer.service';

@Injectable()
export class HandlerWelcomeMessage implements OnModuleInit {
    constructor(private readonly messageService: MessageService,
                private readonly consumerService: ConsumerService
        ){}

    async onModuleInit() {
        try{
            await this.consumerService.consume('welcome_group',{topics: ['chat_created']}, {
                eachMessage: async ({topic, partition, message}) => {
                  const chatId =  parseInt(message.key.toString())
                  const kafkaMessageData = JSON.parse(message.value.toString())
                  const messageData = {
                    text: `Welcome to ${kafkaMessageData.chatName} chat`,
                    user_id: parseInt(kafkaMessageData.userId),
                    chat_id: chatId 
                  }
                  console.log(messageData, partition.toString())
                  await this.messageService.createMessage(messageData)
                }
              })
        } catch(err){
            console.log(err)
        }
      }
}