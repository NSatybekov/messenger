import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { ChatMemberService } from './chat_member.service';
import { ChatMemberDTO } from './chat_member.entity';

@ApiBearerAuth()
@ApiTags('chat members')
@Controller('chat/:id/members')
export class ChatMemberController {
  constructor(private readonly chatMemberService: ChatMemberService) {}

  @ApiParam({ name: 'id', description: ' chat id' })
  @ApiOperation({ summary: 'Get list of chat members' })
  @UseGuards(JwtGuard)
  @Get()
  getChats(@GetUser() user: UserLoginInterface, @Param('id') chat_id) {
    return this.chatMemberService.getChatMembers(user, chat_id);
  }

  @ApiParam({ name: 'id', description: ' chat id' })
  @ApiOperation({ summary: 'add member to chat' })
  @UseGuards(JwtGuard)
  @Post()
  addUserToChat(
    @GetUser() iniciator: UserInterface,
    @Param('id') chat_id: number,
    @Body() body: ChatMemberDTO,
  ) {
    const { user_id, role } = body;
    return this.chatMemberService.addMemberToChatAttempt(
      iniciator,
      chat_id,
      user_id,
      role,
    );
  }

  @ApiParam({ name: 'id', description: ' chat id' })
  @ApiOperation({ summary: 'update user - make admin or member' })
  @UseGuards(JwtGuard)
  @Put()
  UpdateUserRights(
    @GetUser() iniciator: UserInterface,
    @Param('id') chat_id,
    @Body() body: ChatMemberDTO,
  ) {
    const { user_id, role } = body;
    return this.chatMemberService.updateUserRoleOrThrow(
      iniciator,
      chat_id,
      user_id,
      role,
    );
  }

  @ApiParam({ name: 'id', description: ' chat id' })
  @ApiOperation({ summary: 'delete member from chat' })
  @UseGuards(JwtGuard)
  @Delete()
  DeleteUserFromChat(
    @GetUser() iniciator: UserInterface,
    @Param('id') chat_id,
    @Body() body: ChatMemberDTO,
  ) {
    const user_id = body.user_id;
    return this.chatMemberService.deleteChatMember(iniciator, chat_id, user_id);
  }
}
