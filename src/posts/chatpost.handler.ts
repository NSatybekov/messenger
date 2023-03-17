import { Controller, Injectable, OnModuleInit } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ConsumerService } from 'src/kafka/consumer.service';
import { PostsService } from './posts.service';
import { PostCreateInterface } from './posts.entity';

@Injectable()
export class HandlerChatPost implements OnModuleInit {
    constructor(private readonly postService: PostsService,
                private readonly consumerService: ConsumerService
        ){}

    async onModuleInit() {
        try{
            await this.consumerService.consume('chatPost_group',{topics: ['chat_created']}, {
                eachMessage: async ({topic, partition, message}) => {
                  const chatId =  parseInt(message.key.toString())
                  const kafkaMessageData = JSON.parse(message.value.toString())
                  const postData: PostCreateInterface = {
                    name: `This post name: ${kafkaMessageData.chatName} `,
                    user_id: parseInt(kafkaMessageData.userId),
                    text: `This is posts text to test how it will work - name of chat:${kafkaMessageData.chatName} `
                  }
                  console.log(postData, partition.toString())
                  await this.postService.createPostToDb(postData)
                }
              })
        } catch(err){
            console.log(err)
        }
      }
} // одно и то же сообщение в двух местах, попробовать отправлять несколько событий, один и тот же топик реагировать в разных местах и как сделать перезагрузку кафки - 