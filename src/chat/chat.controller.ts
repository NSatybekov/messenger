import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserLoginInterface } from 'src/auth/dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ChatNameDto } from './chat.entity';
import { ChatService } from './chat.service';


@Controller('chat')
export class ChatController {
    constructor(private readonly ChatService: ChatService) {}

    @UseGuards(JwtGuard)
    @Get()
    getChats(@GetUser() user: UserLoginInterface){
        return 'You will get list of all your chats'
    }

    @UseGuards(JwtGuard)
    @Post()
    createSoloChat(@Body() chatName: ChatNameDto, @GetUser() admin: UserLoginInterface){
        return this.ChatService.createSoloChat(chatName, admin)
    }

    @Post('group')
    createGroupChat(){
        return 'You will be able to create group chat'
    }

}
