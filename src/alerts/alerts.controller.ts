import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { AlertsService } from './alerts.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertService: AlertsService) {}

  @UseGuards(JwtGuard)
  @Get()
  getTest() {
    return this.alertService.getAlertsList();
  }
}
