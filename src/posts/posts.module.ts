import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { FriendsService } from 'src/friends/friends.service';
import { FriendsModule } from 'src/friends/friends.module';
import { FriendsRepository } from 'src/friends/friends.repository';

@Module({
  providers: [PostsService, PostsRepository, FriendsService, FriendsRepository],
  controllers: [PostsController],
})
export class PostsModule {}
