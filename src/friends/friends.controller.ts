import { FriendsService } from './friends.service';
import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Sse, MessageEvent, Inject } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { channel } from 'diagnostics_channel';
import { Redis } from 'ioredis';

@ApiBearerAuth()
@ApiTags('friends')
@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @ApiOperation({summary: 'Get list of all your friends'})
    @UseGuards(JwtGuard)
    @Get()
    friendList(@GetUser() user: UserInterface,){
        return this.friendsService.getFriendList(user)
    }

    @ApiOperation({summary: 'Get list of receinved requests'})
    @UseGuards(JwtGuard)
    @Get('received')
    receivedFriendRequests(@GetUser() user: UserInterface,){
        return this.friendsService.getReceivedFriendRequests(user)
    }

    @ApiOperation({summary: 'Get list of sent requests'})
    @UseGuards(JwtGuard)
    @Get('sent')
    sentRequests(@GetUser() user: UserInterface,){
        return this.friendsService.getSentFriendRequests(user)
    }


    @ApiOperation({summary: 'Create friend request - to get users list make get request to users endpoint'})
    @UseGuards(JwtGuard)
    @Post(':id')
    sendFriendRequest(@GetUser() user: UserInterface, @Param('id') friend_id: number ){
        return this.friendsService.sendFriendRequest(user, friend_id)
    }

    @ApiOperation({summary: 'Accept friends requests - you can get list of friend requests from'})
    @UseGuards(JwtGuard)
    @Put(':id')
    acceptRequest(@GetUser() user: UserInterface, @Param('id') friend_id: number ){
        return this.friendsService.acceptFriendRequest(user, friend_id)
    }

    @ApiOperation({summary: 'Delete friend'})
    @UseGuards(JwtGuard)
    @Delete(':id')
    deleteFriend(@GetUser() user: UserInterface, @Param('id') friend_id: number){
        return this.friendsService.deleteFriend(user, friend_id)
    }

    @ApiOperation({summary: 'Block user'})
    @UseGuards(JwtGuard)
    @Post(':id/block')
    blockUser(@GetUser() user: UserInterface, @Param('id') friend_id: number){
        return this.friendsService.blockUser(user, friend_id)
    }
}
