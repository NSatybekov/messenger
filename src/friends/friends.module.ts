import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendsRepository } from './friends.repository';

@Module({
  providers: [FriendsService, FriendsRepository],
  controllers: [FriendsController]
})
export class FriendsModule {}
