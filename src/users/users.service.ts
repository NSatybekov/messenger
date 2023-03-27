/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserRepository } from './users.repository';
import { Redis } from 'ioredis';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly repository: UserRepository,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async findAll(): Promise<object> {
    const users = await this.repository.findAll();
    return { users };
  }

  async findOne(id: number): Promise<object> {
    try {
      const user = await this.repository.findUser(id);
      if (!user) {
        throw new NotFoundException(`User ${id} does not exist`);
      }
      const { hash, ...userWithoutHash } = user;
      return userWithoutHash;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   try {
  //     const users = await this.knex.table('users').where('id', id).update({
  //       firstName: updateUserDto.firstName,
  //       lastName: updateUserDto.lastName,
  //     });

  //     return { users };
  //   } catch (err) {
  //     throw new HttpException(err, HttpStatus.BAD_REQUEST);
  //   }
  // }
}
