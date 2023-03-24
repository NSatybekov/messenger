import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { CommentsModule } from 'src/comments/comments.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { PostsModule } from 'src/posts/posts.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
 
@Module({
  imports: [
    ConfigModule,
    KafkaModule,
    CommentsModule,
    PostsModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        }
      }),
      inject: [ConfigService], 
    }),
  ],
  exports: [ElasticsearchModule],
  controllers: [SearchController],
  providers: [SearchService, KafkaModule, PostsModule, CommentsModule]
})
export class SearchModule {}
