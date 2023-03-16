import { HttpException, Injectable } from '@nestjs/common';
import { stat } from 'fs';
import { UserInterface } from 'src/auth/dto';
import { FriendsService } from 'src/friends/friends.service';
import { ProducerService } from 'src/kafka/producer.service';
import { PostCreateInterface, PostInterface } from './posts.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly repository: PostsRepository,
    private readonly friendService: FriendsService,
    private readonly kafkaProduce: ProducerService
  ) {}

  async createPost(
    user: UserInterface,
    postName: string,
    postText: string,
  ): Promise<PostInterface> {
    try {
      const postData: PostCreateInterface = {
        user_id: user.user_id,
        name: postName,
        text: postText,
      };
      const post = await this.repository.createPost(postData);
      await this.produceToKafka(postText, user.user_id)
      return post;
    } catch {
      throw new HttpException('Cannot create', 404);
    }
  }

  async createPostToDb(postData: PostCreateInterface){
    return this.repository.createPost(postData)
  } 

  async produceToKafka(postText: string, userId): Promise<void>{
  const idString = await userId.toString()
    this.kafkaProduce.produce({ 
      topic: 'Created_post',
      messages: [{key: idString, value: postText}]
    })
  }

  async getUserPosts(user_id: number): Promise<PostInterface[]> {
    return this.repository.findUserPosts(user_id);
  }

  async editPostTry(
    user: UserInterface,
    post_id: number,
    postName?: string,
    postText?: string,
  ) {
    const author = await this.isUserAuthor(user.user_id, post_id);
    if (author) {
      const status = await this.editPost(post_id, postName, postText);
      if (status) {
        return this.repository.findPostById(post_id);
      } else {
        throw new HttpException('Post not updated', 404);
      }
    } else {
      throw new HttpException('YOu are not author', 404);
    }
  }

  async editPost(post_id: number, postName?: string, postText?: string) {
    return this.repository.editPost(post_id, postText, postName);
  }

  async deletePost(user: UserInterface, post_id: number) {
    const author = await this.isUserAuthor(user.user_id, post_id);
    if (author) {
      return this.repository.deletePost(post_id);
    } else {
      throw new HttpException('You are not authour', 404);
    }
  }

  async isUserAuthor(user_id: number, post_id: number): Promise<boolean> {
    return await this.repository.isUserPostAuthor(user_id, post_id);
  }

  async getAnotherUsersPosts(user: UserInterface, friend_id: number) {
    const isBlocked = await this.friendService.blockStatus(
      user.user_id,
      friend_id,
    );
    if (!isBlocked) {
      return this.getUserPosts(friend_id);
    } else {
      throw new HttpException('You are blocked', 404);
    }
  }

  async getFeedPosts(user: UserInterface) {
    const friendList = await this.friendService.getFriendList(user);
    const sentList = await this.friendService.getSentFriendRequests(user)
    try {
      const sentIds = sentList.map((sent) => sent.friend_id)
      const allIds = friendList.flatMap((friend) => {
        const arrayAll = [friend.friend_id, friend.user_id]; // create array that will flat (join) this small arrays that contain friend id and user id
        return arrayAll;
      });
      const userIds = Array.from(new Set(allIds)); // create set to get unique values only so i will not get duplicate posts
      const allUserIds = userIds.concat(sentIds)
      return this.repository.getFeedPosts(allUserIds);
    } catch {
      throw new HttpException('Something wrong', 404);
    }
  }

  async getPostInfoById(post_id: number): Promise<PostInterface>{
    return this.repository.findPostById(post_id)
  }
}
