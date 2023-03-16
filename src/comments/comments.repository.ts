import { Injectable, Type } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CommentCreateInterface, CommentInterface } from './comments.entity';
import { PostInterface } from 'src/posts/posts.entity';

@Injectable()
export class CommentsRepository {
    private readonly TABLE_NAME = 'comments'
    constructor(@InjectModel() private readonly db: Knex) {} 

    async addComment(commentData : CommentCreateInterface): Promise<CommentInterface>{
        const comment = await this.db.table(this.TABLE_NAME).insert(commentData)
                                     .returning(['user_id', 'comment_id', 'post_id', 'created_at', 'text'])
        return comment[0]
    }

    async getPostComments(post_id: number): Promise<CommentInterface[]>{
        const comments = await this.db.select('*').table(this.TABLE_NAME)
                                                  .where({post_id})
        return comments

    }

    async getUsersComments(user_id: number): Promise<CommentInterface[]> {
        const comments = await this.db.select('*').table(this.TABLE_NAME)
                                                  .where({user_id})
        return comments
    }

    async deleteComment(comment_id: number): Promise<boolean>{
        const result = await this.db.table(this.TABLE_NAME).where({comment_id})
                                                           .delete()
        return result > 0 ? true : false
    }

    async editComment(comment_id: number, newText: string): Promise<boolean>{
        const result = await this.db.table(this.TABLE_NAME).where({comment_id})
                                                           .update({text: newText})
        return result > 0 ? true : false
    }

    async getCommentById(comment_id: number): Promise<CommentInterface>{
        const comment = await this.db.select('*').table(this.TABLE_NAME).where({comment_id})
        return comment[0]
    }

}