import { Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import { ConsumerRunConfig } from "@nestjs/microservices/external/kafka.interface";
import { Kafka, Consumer, ConsumerSubscribeTopics } from "kafkajs";

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
    private readonly kafka = new Kafka({
        brokers: ['localhost:9092'],
        retry: {
            maxRetryTime: 60000,
            initialRetryTime: 500,
            retries: 5,

        }
    });


    private readonly consumers: Consumer[] = []

    async consume(groupId: string,topics: ConsumerSubscribeTopics,  config: ConsumerRunConfig){
        const consumer = this.kafka.consumer({groupId: groupId, heartbeatInterval: 3000, sessionTimeout: 10000})
        await consumer.connect()
        await consumer.subscribe(topics)
        try{
        await consumer.run(config)
        }
        catch(err){
            const logger = this.kafka.logger()
            logger.error(`Failed to consume message from topic ${topics}`)
            console.log(`Failed to consume message from topic ${topics}`)
        }
        this.consumers.push(consumer)
    }


    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            await consumer.disconnect()
        }
    }

}