import { HttpException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { stat } from 'fs';
import { UserInterface } from 'src/auth/dto';
import { CommentsService } from 'src/comments/comments.service';
import { FriendsService } from 'src/friends/friends.service';
import { ProducerService } from 'src/kafka/producer.service';
import { PostCreateInterface, PostInterface } from './posts.entity';
import { PostsRepository } from './posts.repository';
import * as faker from 'faker';


@Injectable()
export class PostsService {
  constructor(
    private readonly repository: PostsRepository,
    private readonly friendService: FriendsService,
    private readonly kafkaProduce: ProducerService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentService: CommentsService,
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
      await this.produceToKafka(post);
      return post;
    } catch {
      throw new HttpException('Cannot create', 404);
    }
  }

  // async seed() {
  //   const totalUsers = 101;
  //   for (let i = 0; i < 500000; i++) {
  //     const user_id = faker.datatype.number({min: 1, max: totalUsers});
  //     const postName = faker.lorem.words().slice(0, 50);;
  //     const postText = faker.lorem.paragraphs().slice(0, 1000);
  //     await this.createPost( user_id,  postName, postText );
  //   }
  // }

  async createPostToDb(postData: PostCreateInterface) {
    return this.repository.createPost(postData);
  }

  async produceToKafka(postData: PostInterface): Promise<void> {
    const idString = await postData.post_id.toString();
    const dataToKafka = JSON.stringify(postData)
    this.kafkaProduce.produce({
      topic: 'created_post',
      messages: [{ 
        key: idString,
        value: dataToKafka }],
    });
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
    const sentList = await this.friendService.getSentFriendRequests(user);
    try {
      const sentIds = sentList.map((sent) => sent.friend_id);
      const allIds = friendList.flatMap((friend) => {
        const arrayAll = [friend.friend_id, friend.user_id]; // create array that will flat (join) this small arrays that contain friend id and user id
        return arrayAll;
      });
      const userIds = Array.from(new Set(allIds)); // create set to get unique values only so i will not get duplicate posts
      const allUserIds = userIds.concat(sentIds);
      return this.repository.getFeedPosts(allUserIds);
    } catch {
      throw new HttpException('Something wrong', 404);
    }
  }

  async getPostInfoById(post_id: number): Promise<PostInterface> {
    return this.repository.findPostById(post_id);
  }

  async findPostByText(user: UserInterface, text: string) {
    try {
      const posts = await this.repository.findPostByText(text);
      const comments = await this.commentService.findCommentsByText(text);
      const postIdsFromComment = comments.map((comment) => comment.post_id);
      const postsFromComments = await this.repository.findPostsByIdsArray(postIdsFromComment);
      const allPosts = postsFromComments.concat(posts)
    // probably better to get data from DB already without users from block list to optimize it
      return {
        allPosts
      };
    } catch {
      throw new HttpException('No such post', 404);
    }
  }

  async getAllPostsList(): Promise<PostInterface[]>{
    return this.repository.getAllPosts()
  }
}
