import { Injectable, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer, ProducerRecord, Partitioners } from "kafkajs";

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown{
    private readonly kafka = new Kafka({
        brokers: ['localhost:9092'],
        retry: {
            maxRetryTime: 60000,
            initialRetryTime: 500,
            retries: 5
        }
    });
    private readonly producer: Producer = this.kafka.producer({createPartitioner: Partitioners.LegacyPartitioner})

    async onModuleInit() {
        await this.producer.connect()
    }

    async produce(record: ProducerRecord){
        try{
        await this.producer.send(record)
        }catch (error) {
            const logger = this.kafka.logger();
            logger.error(`Failed to produce message: ${error.message}`, { error });
          }
    }

    async onApplicationShutdown(signal?: string) {
        await this.producer.disconnect()
    }
}