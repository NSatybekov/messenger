import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { PostInterface, PostCreateInterface } from './posts.entity';

@Injectable()
export class PostsRepository {
  private readonly TABLE_NAME = 'posts';
  constructor(@InjectModel() private readonly db: Knex) {}

  async createPost(postData: PostCreateInterface): Promise<PostInterface> {
    const post = await this.db
      .table(this.TABLE_NAME)
      .insert(postData)
      .returning(['post_id', 'user_id', 'text', 'created_at', 'name']);
    return post[0];
  }

  async findUserPosts(user_id: number): Promise<PostInterface[]> {
    const posts = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ user_id })
      .limit(30);
    return posts;
  }

  async findPostById(post_id: number): Promise<PostInterface> {
    const post = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where({ post_id })
      .limit(30);
    return post[0];
  }

  async findPostsByIdsArray(post_ids: number[]): Promise<PostInterface[]> {
    const posts = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .whereIn('post_id', post_ids)
      .limit(30);
    return posts;
  }

  async editPost(post_id: number, postText?: string, postName?: string) {
    const result = await this.db
      .table(this.TABLE_NAME)
      .where({ post_id })
      .update({ text: postText, name: postName });
    return result > 0 ? true : false;
  }

  async deletePost(post_id: number) {
    const result = await this.db
      .table(this.TABLE_NAME)
      .where({ post_id })
      .delete();
    return result > 0 ? true : false;
  }

  async isUserPostAuthor(user_id: number, post_id: number): Promise<boolean> {
    const result = await this.db
      .table(this.TABLE_NAME)
      .where({ post_id, user_id });
    return result.length > 0 ? true : false;
  }

  async getFeedPosts(userIds: number[]) {
    const result = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .whereIn('user_id', userIds);
    return result;
  }

  async findPostByText(text: string): Promise<PostInterface[]> {
    const result = await this.db
      .select('*')
      .table(this.TABLE_NAME)
      .where(this.db.raw('name ilike ?', `%${text}%`))
      .orWhere(this.db.raw('text ilike ?', `%${text}%`))
      .limit(30);
    return result;
  }

  async getAllPosts(): Promise<PostInterface[]> {
    const result = await this.db.select('*').table(this.TABLE_NAME);
    return result;
  }
}
