import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  providers: [AlertsService, KafkaModule],
  controllers: [AlertsController],
  imports: [KafkaModule]
})
export class AlertsModule {}
