import { Injectable, OnModuleInit } from '@nestjs/common';
import { async } from 'rxjs';
import { ConsumerService } from 'src/kafka/consumer.service';

@Injectable()
export class AlertsService {
    constructor (private readonly consumerService: ConsumerService) {}
    async getAlertsList(user){
       return 'testing kafka'
    }

    async onModuleInit() {
        await this.consumerService.consume('alerts_group',{topics: ['created_post', 'Created_message', 'chat_created', 'created_comment']}, {
            eachMessage: async ({topic, partition, message}) => {
                console.log({
                    message: message.value.toString(),
                    key: message.key.toString(),
                    partition: partition.toString(),
                    topic: topic.toString()
                })
            }
        })
    }
} 
