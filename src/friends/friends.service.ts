import { HttpException, Injectable, Inject } from '@nestjs/common';
import { FriendsRepository } from './friends.repository';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';
import { FriendRequestInterface, FriendInterface } from './friends.entity';
import e from 'express';

@Injectable()
export class FriendsService {
  constructor(private readonly repository: FriendsRepository) {}

  async sendFriendRequest(user: UserInterface, friend_id: number) {
    const friendship = await this.getFriendsInfo(user.user_id, friend_id);
    try {
      if (!friendship ) {
        const friendData: FriendRequestInterface = {
          user_id: user.user_id,
          friend_id,
          friend_status: 'SENT',
        };
        return await this.repository.createFriendRequest(friendData);
      } else {
        throw new HttpException("Can't send request to this user", 404);
      }
    } catch {
      throw new HttpException("Can't send request to this user", 404);
    }
  }

  async getFriendsInfo(user_id: number, friend_id: number) {
    return await this.repository.getFriendshipInfo(user_id, friend_id);
  }

  async getFriendList(user: UserInterface) {
    return this.repository.getFriendList(user.user_id);
  }

  async acceptFriendRequest(user: UserInterface, friend_id: number) {
    const friendship = await this.getFriendsInfo(user.user_id, friend_id);
    try{
        if(friendship.friend_status === 'SENT' && friendship.friend_id === user.user_id){
            const result = await this.repository.acceptFriendRequest(friend_id ,user.user_id)
            if(result) {
                return 'User added'
            }
        } else {
            throw new HttpException('Cant accept request', 404)
        }
    }
    catch{
        throw new HttpException('Cant accept', 404)
    }
  }

  async deleteFriend(user: UserInterface, friend_id: number) {
    const friendship = await this.getFriendsInfo(user.user_id, friend_id)
    if(friendship) {
        return await this.repository.deleteFriend(user.user_id, friend_id)
    }
    else {
        throw new HttpException('No such friend', 404)
    }
  }

  async blockUser(user: UserInterface, friend_id: number) {
    try{
        await this.repository.deleteFriend(user.user_id, friend_id)
        const blocked = await this.repository.blockFriend(user.user_id, friend_id)
        return blocked
    } catch{
        throw new HttpException('Cannot block', 404)
    }
  }
}
