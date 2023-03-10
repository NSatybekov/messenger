import { Injectable, Type } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserInterface } from 'src/auth/dto';
import { PostInterface, PostCreateInterface, PostDto } from './posts.entity';

@Injectable()
export class PostsRepository {
    private readonly TABLE_NAME = 'posts'
    constructor(@InjectModel() private readonly db: Knex) {} 

    async createPost(postData: PostCreateInterface) : Promise<PostInterface>{
        const post = await this.db.table(this.TABLE_NAME).insert(postData)
                                                         .returning(['post_id', 'user_id', 'text', 'created_at', 'name'])
        return post[0]
    }


    async findUserPosts(user_id: number):  Promise<PostInterface[]> {
        const messages = await this.db.select('*').table(this.TABLE_NAME).where({user_id})
        return messages
    }

    async findPostById(post_id: number): Promise<PostInterface>{
        const message = await this.db.select('*').table(this.TABLE_NAME).where({post_id})
        return message[0]
    }

    async editPost(post_id: number, postText? : string, postName?: string){
        const result = await this.db.table(this.TABLE_NAME).where({post_id}).update({text: postText, name: postName})
        return result > 0 ? true : false 
    }

    async deletePost(post_id: number){
        const result = await this.db.table(this.TABLE_NAME).where({post_id}).delete()
        return result > 0 ? true : false
    }


    async isUserPostAuthor(user_id: number, post_id: number): Promise<boolean>{
        const result = await this.db.table(this.TABLE_NAME).where({post_id, user_id})
        return result.length > 0 ? true : false            
    }

    async getFeedPosts(userIds: number[]){
        const result = await this.db.select('*').table(this.TABLE_NAME).whereIn('user_id', userIds)
        return result
    }


}