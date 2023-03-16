import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Sse, MessageEvent, Inject } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { AlertsService } from './alerts.service';
import { GetUser } from 'src/auth/decorator';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('alerts')
export class AlertsController {
    constructor(private readonly alertService: AlertsService){}



    @UseGuards(JwtGuard)
    @Get()
    getTest(@GetUser() user: UserInterface,){
        return this.alertService.getAlertsList(user)
    }
}
