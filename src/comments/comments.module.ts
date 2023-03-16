import { Module, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { PostsModule } from 'src/posts/posts.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [PostsModule, FriendsModule]
})
export class CommentsModule {}
