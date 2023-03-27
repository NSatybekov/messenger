import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { FriendsService } from 'src/friends/friends.service';
import { FriendsRepository } from 'src/friends/friends.repository';
import { KafkaModule } from 'src/kafka/kafka.module';
import { HandlerChatPost } from './chatpost.handler';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  providers: [
    PostsService,
    PostsRepository,
    FriendsService,
    FriendsRepository,
    KafkaModule,
    HandlerChatPost,
  ],
  controllers: [PostsController],
  exports: [PostsService],
  imports: [KafkaModule, forwardRef(() => CommentsModule)],
})
export class PostsModule {}
