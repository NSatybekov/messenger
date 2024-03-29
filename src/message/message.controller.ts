import { MessageService } from './message.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Sse,
  MessageEvent,
  Inject,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserInterface } from 'src/auth/dto';
import { MessageDto } from './message.entity';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { Redis } from 'ioredis';
import { HandlerWelcomeMessage } from './welcome.handler';

@ApiBearerAuth()
@ApiTags('messages')
@Controller('chat/:chatId/message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly eventEmitter: EventEmitter2,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
    private readonly messageHandler: HandlerWelcomeMessage,
  ) {}

  @ApiParam({ name: 'chatId', description: ' Chat id' })
  @UseGuards(JwtGuard)
  @Get()
  getMessages(@GetUser() user: UserInterface, @Param('chatId') chat_id) {
    return this.messageService.findAllMessagesInChat(user, chat_id);
  }

  @ApiParam({ name: 'chatId', description: ' Chat id' })
  @UseGuards(JwtGuard)
  @Get('mine')
  myMessages(@GetUser() user: UserInterface, @Param('chatId') chat_id) {
    return this.messageService.findUserMessagesInChat(user, chat_id);
  }

  @ApiParam({ name: 'chatId', description: ' Chat id' })
  @UseGuards(JwtGuard)
  @Post()
  sendMessage(
    @GetUser() user: UserInterface,
    @Body() message: MessageDto,
    @Param('chatId') chat_id,
  ) {
    return this.messageService.sendMessage(user, message, chat_id);
  }

  @Sse('sse')
  sse(@Param('chatId') chat_id): Observable<MessageEvent> {
    return new Observable<MessageEvent>((observer) => {
      const redisListener = (channel, message) => {
        // i added channel because reddis have channel property from redis pub
        if (channel === `newMessage_${chat_id}`) {
          observer.next({ data: message });
        }
      };
      this.redisClient.subscribe(`newMessage_${chat_id}`, (err) => {
        // if there is no error,
        if (err) {
          observer.error(err);
        } else {
          this.redisClient.on('message', redisListener); // message is standart redis event name
        }
      });

      return () => {
        this.redisClient.unsubscribe(`newMessage_${chat_id}`);
        this.redisClient.removeListener('message', redisListener);
      };
    });
  }

  @ApiParam({ name: 'messageId', description: ' message id' })
  @ApiParam({ name: 'chatId', description: ' Chat id' })
  @UseGuards(JwtGuard)
  @Put(':messageId')
  updateMessage(
    @GetUser() user: UserInterface,
    @Body() message: MessageDto,
    @Param('messageId') message_id,
  ) {
    return this.messageService.updateMessageTry(user, message_id, message);
  }

  @ApiParam({ name: 'messageId', description: ' message id' })
  @UseGuards(JwtGuard)
  @Delete(':messageId')
  deleteMessage(
    @GetUser() user: UserInterface,
    @Param('messageId') message_id: number,
  ) {
    return this.messageService.deleteMessageTry(user, message_id);
  }
}
