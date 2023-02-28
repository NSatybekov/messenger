

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/create-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(@InjectModel() private readonly knex: Knex,
              private readonly repository: UserRepository) {}

  async  findAll() : Promise<object>  {
    const users = await this.repository.findAll();
    return { users };
  }

  async findOne(id: number) : Promise<object> {
    try{
      const user = await this.repository.findUser(id)
      if(!user) {  
        throw new NotFoundException(`User ${id} does not exist`)
      }
      const {hash, ...userWithoutHash} = user
      return userWithoutHash
    }
    catch (err) {
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