import { Module, forwardRef } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { PostsModule } from 'src/posts/posts.module';
import { FriendsModule } from 'src/friends/friends.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  providers: [CommentsService, CommentsRepository, KafkaModule],
  controllers: [CommentsController],
  exports: [CommentsService],
  imports: [FriendsModule, forwardRef(() => PostsModule), KafkaModule],
})
export class CommentsModule {}
