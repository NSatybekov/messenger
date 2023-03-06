import { FriendsService } from './friends.service';
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Sse, MessageEvent, Inject } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { channel } from 'diagnostics_channel';
import { Redis } from 'ioredis';

@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @UseGuards(JwtGuard)
    @Get()
    friendList(@GetUser() user: UserInterface,){
        return this.friendsService.getFriendList(user)
    }

    @UseGuards(JwtGuard)
    @Post(':id')
    sendFriendRequest(@GetUser() user: UserInterface, @Param('id') friend_id: number ){
        return this.friendsService.sendFriendRequest(user, friend_id)
    }

    @UseGuards(JwtGuard)
    @Put(':id')
    acceptRequest(@GetUser() user: UserInterface, @Param('id') friend_id: number ){
        return this.friendsService.acceptFriendRequest(user, friend_id)
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    deleteFriend(@GetUser() user: UserInterface, @Param('id') friend_id: number){
        return this.friendsService.deleteFriend(user, friend_id)
    }

    @UseGuards(JwtGuard)
    @Post(':id/block')
    blockUser(@GetUser() user: UserInterface, @Param('id') friend_id: number){
        return this.friendsService.blockUser(user, friend_id)
    }
}
