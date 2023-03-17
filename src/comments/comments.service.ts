import { HttpException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { use } from 'passport';
import { async } from 'rxjs';
import { UserInterface } from 'src/auth/dto';
import { FriendsService } from 'src/friends/friends.service';
import { PostInterface } from 'src/posts/posts.entity';
import { PostsService } from 'src/posts/posts.service';
import { CommentCreateInterface, CommentInterface } from './comments.entity';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
    constructor(private readonly repository: CommentsRepository,
                private readonly friendService: FriendsService,
                @Inject(forwardRef(() => PostsService))
                private readonly postService: PostsService
        ){}

    async addComment(user: UserInterface, post_id: number, text: string){
        const commentData: CommentCreateInterface = {
            user_id: user.user_id,
            post_id,
            text
        }

        const postInfo = await this.postService.getPostInfoById(post_id)

            const isBlocked = await this.friendService.blockStatus(
                user.user_id,
                postInfo.user_id,
              )
            if(!isBlocked){
                return this.repository.addComment(commentData)
            } else{
                throw new HttpException('You are block', 404)
            }

    }

    async getPostComments(user: UserInterface, post_id: number){
        const postInfo = await this.postService.getPostInfoById(post_id)
        const isBlocked = await this.friendService.blockStatus(
            user.user_id,
            postInfo.user_id,
          )
        if(!isBlocked){
            return this.repository.getPostComments(post_id)
        } else{
            throw new HttpException('Cant add comment', 404)
        }

    }

    async getMyComments(user: UserInterface){
        return await this.getUserComments(user.user_id)
    }

    async getUserCommentTry(user: UserInterface, secondUserId: number){
        const isBlocked = await this.friendService.blockStatus(user.user_id, secondUserId)
        if(!isBlocked){
            return this.repository.getUsersComments(secondUserId)
        } else{
            throw new HttpException('Cant get comment', 404)
        }     
    }

    async getUserComments(user_id: number){
        return await this.repository.getUsersComments(user_id)
    }

    async deleteComment(user: UserInterface, comment_id: number){
        const postInfo = await this.getPostInfoByComment(comment_id)
        const isAuthor = await this.isUserAuthor(user.user_id, comment_id)
        if(isAuthor || postInfo.user_id === user.user_id) { // if user is post owner he can delete comment
            return this.repository.deleteComment(comment_id)
        }else{
            throw new HttpException('Cant delete comment', 404)
        }
    }

    async editComment(user: UserInterface, comment_id: number, newText: string){  
        const isAuthor = await this.isUserAuthor(user.user_id, comment_id)
        if(isAuthor){
            return this.repository.editComment(comment_id, newText)
        } else{
            throw new HttpException('Cant edit comment', 404)
        }
    }   

    async isUserAuthor(user_id: number, comment_id: number): Promise<boolean>{
        const comment = await this.repository.getCommentById(comment_id)
        if(user_id === comment.user_id){
            return true
        }
        else {
            return false
        }
    }

    async getPostInfoByComment(comment_id: number): Promise<PostInterface> {
        const commentInfo = await this.repository.getCommentById(comment_id)
        const postInfo = await this.postService.getPostInfoById(commentInfo.post_id)
        return postInfo
    }

    async findCommentsByText(text: string): Promise<CommentInterface[]>{
        return this.repository.findCommentByText(text)
    }
}
