import { MessageService } from './message.service';
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Sse, MessageEvent } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { MessageDto, MessageInterface } from './message.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {MessageCreateInterface} from './message.entity'

@ApiBearerAuth()
@ApiTags('messages')
@Controller('chat/:chatId/message')
export class MessageController {
    constructor(private readonly messageService: MessageService,
      private readonly eventEmitter: EventEmitter2
      ) {}

    @UseGuards(JwtGuard)
    @Get()
    getMessages(@GetUser() user: UserInterface, @Param('chatId') chat_id ) {
        return this.messageService.findAllMessagesInChat(user,chat_id)
      }

      @UseGuards(JwtGuard)
      @Post()
      sendMessage(@GetUser() user: UserInterface, @Body() message: MessageDto, @Param('chatId') chat_id) {
          return this.messageService.sendMessage(user, message, chat_id);
        }

        @Sse('sse')
        sse(@Param('chatId') chat_id): Observable<MessageEvent> {
          return new Observable<MessageEvent>((observer) => {
            const eventListener = (data) => {
              observer.next({ data: data.message }); // data message because in emitter it worte that message
            };
      
            this.eventEmitter.on(`newMessage_${chat_id}`, eventListener);
      
            return () => { //  "teardown function". This function is called when the observer unsubscribes from the Observable stream, it will still work if i will return just any value
              this.eventEmitter.off(`newMessage_${chat_id}`, eventListener); // we make off to release not needed ended events else it will cause memory leak.
            }; 
          })
        }
      }
