import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { FriendInterface, FriendRequestInterface } from './friends.entity';

@Injectable()
export class FriendsRepository {
  private readonly TABLE_NAME = 'friends';
  constructor(@InjectModel() private readonly db: Knex) {}

  async getFriendList(user_id: number) {
    const message = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where(function () {
        this.where({ user_id: user_id, friend_status: 'FRIEND' }).orWhere({
          friend_id: user_id,
          friend_status: 'FRIEND',
        });
      });
    return message;
  }

  async createFriendRequest(
    friendshipData: FriendRequestInterface,
  ): Promise<FriendInterface> {
    const friend = await this.db
      .table(this.TABLE_NAME)
      .insert(friendshipData)
      .returning(['user_id', 'friend_id', 'friend_status', 'created_at']);
    return friend[0];
  }

  async acceptFriendRequest(
    user_id: number,
    friend_id: number,
  ): Promise<boolean> {
    const result = await this.db
      .table(this.TABLE_NAME)
      .where({ user_id, friend_id })
      .update({ friend_status: 'FRIEND' });
    return result > 0 ? true : false;
  }

  async getFriendshipInfo(user_id: number, friend_id: number) {
    const result = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ user_id, friend_id })
      .orWhere({ user_id: friend_id, friend_id: user_id })
      .first();
    return result;
  }

  async deleteFriend(
    user_id: number,
    friend_id: number,
    trx?: Knex.Transaction,
  ) {
    const result = await (trx || this.db)
      .table(this.TABLE_NAME)
      .where({ user_id, friend_id })
      .orWhere({ user_id: friend_id, friend_id: user_id })
      .delete();
    return result > 0 ? true : false;
  }

  async blockFriend(
    blocker_id: number,
    blocked_id: number,
    trx?: Knex.Transaction,
  ) {
    const friend = await (trx || this.db)
      .table(this.TABLE_NAME)
      .insert({
        user_id: blocker_id,
        friend_id: blocked_id,
        friend_status: 'BLOCKED',
      })
      .returning(['user_id', 'friend_id', 'friend_status', 'created_at']);
    return friend[0];
  }

  getTransaction() {
    return this.db.transaction();
  }

  async isUserBlockedByFriend(
    requester_id: number,
    blocker_id: number,
  ): Promise<FriendInterface> {
    const result = await this.db
      .select('friend_status')
      .table(this.TABLE_NAME)
      .where({ user_id: blocker_id, friend_id: requester_id })
      .first();
    return result;
  }

  async getSentRequests(user_id: number): Promise<FriendInterface[]> {
    const result = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ user_id, friend_status: 'SENT' });
    return result;
  }

  async getReceivedRequests(user_id: number): Promise<FriendInterface[]> {
    const result = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ friend_id: user_id, friend_status: 'SENT' });
    return result;
  }

  async getBlockedUsersList(user_id: number) {
    const result = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ user_id, friend_status: 'BLOCKED' });
    return result;
  }
}
