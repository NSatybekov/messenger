import { ConsoleLogger, HttpException, Injectable, Logger, OnApplicationShutdown, OnModuleInit } from "@nestjs/common";
import { ConsumerRunConfig } from "@nestjs/microservices/external/kafka.interface";
import { Kafka, Consumer, ConsumerSubscribeTopics } from "kafkajs";
import { Client } from '@elastic/elasticsearch';
import { ConsumerService } from "src/kafka/consumer.service";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { PostSearchResult, PostSearchBody } from "./search.entity";
import { CommentInterface } from "src/comments/comments.entity";
import { PostsService } from "src/posts/posts.service";
import { CommentsService } from "src/comments/comments.service";

@Injectable()
export class SearchService{
    constructor(private readonly consumerService: ConsumerService,
                private readonly elasticSearchService: ElasticsearchService,
                private readonly postService: PostsService,
                private readonly commentService: CommentsService
        ) {}

    postIndex = 'created_post'
    commentIndex = 'created_comment'
    async onModuleInit(){
        try{
            await this.consumerService.consume('searchGroup', {topics: ['created_post']}, {
                eachMessage: async ({ topic, partition, message }) => {
                    const postData = JSON.parse(message.value.toString())
                        await this.elasticSearchService.index({
                            index: topic.toString(),
                            body: postData
                        })
                    }
            })

            await this.consumerService.consume('searchGroupComments', {topics: ['created_comment']}, {
                eachMessage: async ({ topic, partition, message }) => {
                    const commentData = JSON.parse(message.value.toString())
                        await this.elasticSearchService.index ({
                            index: topic.toString(),
                            body: commentData
                        })
                    }
            })

        } catch(err){
            console.log('error') 
        }
    }

    async reindexData(){
      try{
        await this.elasticSearchService.deleteByQuery({
          index: this.postIndex,
          body: {
            query: {
              match_all: {}
            }
          }
        });
        
        const allPosts = await this.postService.getAllPostsList()
        const bulkData = allPosts.flatMap((doc) => [
          {index: {_index: this.postIndex, _id: doc.post_id}},
          { user_id: doc.user_id, name: doc.name, text: doc.text, created_at: doc.created_at},
        ])
  
        const bulkResponse = await this.elasticSearchService.bulk({ body: bulkData})
        if (bulkResponse.errors) {
          const errorMessage = bulkResponse.items
            .map((item) => `Error: ${JSON.stringify(item.index.error)}`)
            .join('\n');
          console.error(`Failed to index data:\n${errorMessage}`);
        } else {
          return (`Successfully indexed ${bulkResponse.items.length} items`);
        }
      }
      catch(err){
        throw new HttpException(err, 404)
      }
    }

    async reindexComments(){
      try{
        await this.elasticSearchService.deleteByQuery({
          index: this.commentIndex,
          body: {
            query: {
              match_all: {}
            }
          }
        });
        const allComments = await this.commentService.getAllComments()
        console.log(allComments.length)

        const batchedComments = [];
        const batchSize = 50000;
        for (let i = 0; i < allComments.length; i += batchSize) {
          batchedComments.push(allComments.slice(i, i + batchSize));
        }
    
        const delayMs = 10000; 
        console.log(batchedComments.length)
        for (let i = 0; i < batchedComments.length; i++) {
          const batch = batchedComments[i];
          const bulkData = batch.flatMap((doc) => [ 
            {index: {_index: this.commentIndex, _id: doc.comment_id}},
            { user_id: doc.user_id, comment_id: doc.comment_id, text: doc.text, created_at: doc.created_at, post_id: doc.post_id},
          ])
    
          const bulkResponse = await this.elasticSearchService.bulk({
            body: bulkData
          })
    
          if (bulkResponse.errors) {
            const errorMessage = bulkResponse.items
              .map((item) => `Error: ${JSON.stringify(item.index.error)}`)
              .join('\n');
            console.error(`Failed to index data:\n${errorMessage}`);
          } else {
            console.log(`Successfully sent ${bulkResponse.items.length} items to elastic`);
          }
    
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
      catch(err){
        throw new HttpException(err.message, 404, {cause : new Error(err)})
      }
    }
    

    async search(text: string) {
        const postIds: number[] = await this.searchPostsIdsByTextFromComments(text)
        const response = await this.elasticSearchService.search({
          index: this.postIndex,
          body:  {
            query: {
              bool: {
                should: [
                  {
                    multi_match: {
                      query: text,
                      type: "most_fields",
                      fields: ["*"]
                    }
                  },
                  {
                    terms: {
                      "_id": postIds
                    }
                  }
                ]
              } 
            },
            size: 30
          }
        })
        const hits = response.hits.hits
        const data = hits.map((item: any) => item._source)
          return data;
      }
   
    async searchPostsIdsByTextFromComments(text: string){
        const response = await this.elasticSearchService.search<CommentInterface>({
          index:  this.commentIndex,
          body: { 
            query: {
                multi_match: {
                        query: `*${text}*`,
                        operator: "and",
                        fuzziness: "AUTO",
                        type: "most_fields",
                }
            },
            size: 30
        }
        })
        const comments = response.hits.hits.map((item: any) => item._source);
        const postIds = comments.map((comment: any) => comment.post_id.toString())
        const uniqueIds = Array.from(new Set(postIds))
        return uniqueIds
    }

}
