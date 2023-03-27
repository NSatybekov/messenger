import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ChatNameDto } from './chat.entity';
import { ChatService } from './chat.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Get list of all your chats' })
  @UseGuards(JwtGuard)
  @Get()
  getChats(@GetUser() user: UserLoginInterface) {
    return this.chatService.findUserChats(user);
  }

  @ApiOperation({ summary: 'Create group chat with multiple members' })
  @UseGuards(JwtGuard)
  @Post('group/create')
  async createGroupChat(
    @GetUser() user: UserInterface,
    @Body() body: { name: string; users: string[] },
  ): Promise<any> {
    const { name, users } = body; // деструктурирующее присваивание
    const result = await this.chatService.createGroupChat(user, name, users);
    return result;
  }

  @ApiParam({ name: 'id', description: ' users id to start chat with' })
  @ApiOperation({
    summary:
      'Create 1 one 1 chat with another user, it"s stupid to make chat name in solo chat but will change it later, would be better if i separated solo chats',
  })
  @UseGuards(JwtGuard)
  @Post(':id')
  createSoloChat(
    @Body() chatName: ChatNameDto,
    @GetUser() user: UserLoginInterface,
    @Param('id') secondUserId: number,
  ) {
    return this.chatService.createStandartChat(chatName, user, secondUserId);
  }

  @ApiParam({ name: 'id', description: ' post id' })
  @ApiOperation({ summary: 'find chat by id' })
  @UseGuards(JwtGuard)
  @Get(`:id`)
  findChatById(@Param('id') chatId: number) {
    return this.chatService.findChatById(chatId);
  }
}
