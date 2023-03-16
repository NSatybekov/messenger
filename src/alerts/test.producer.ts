import { Injectable } from "@nestjs/common";
import { ProducerService } from "src/kafka/producer.service";

@Injectable()
export class testService{
    constructor(private readonly producerService: ProducerService){}

    async getTest(){
        await this.producerService.produce({
            topic: 'test',
            messages: [
                {
                    value: 'Hello test value'
                }
            ]
        })
        return 'Hello test world'
    }
}