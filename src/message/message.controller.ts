import { MessageService } from './message.service';
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserLoginInterface } from 'src/auth/dto';
import { MessageDto, MessageInterface } from './message.entity';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @UseGuards(JwtGuard)
    @Get()
    getMe(@GetUser() user: UserLoginInterface) {
        return user;
      }

      @UseGuards(JwtGuard)
      @Post()
      sendMessage(@GetUser() user: UserLoginInterface, @Body() message: MessageDto) {
          return this.messageService.sendMessage(user, message);
        }

}
