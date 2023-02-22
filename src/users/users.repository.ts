import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserLoginInterface } from 'src/auth/dto';

@Injectable()
export class UserRepository {
    private readonly TABLE_NAME = 'users'
    constructor(@InjectModel() private readonly db: Knex) {}
    
    async findAll(): Promise<object> { // how to correctly write what type of value function must return? With interface? or just type like object or string
        const result = await this.db.table(this.TABLE_NAME)
        return result.map(result => { // iterate through result array to delete all hashes
            const { hash, ...newResult} = result
            return newResult
        })
    }

    async signUp(data: UserLoginInterface) {
        const result = await this.db.table(this.TABLE_NAME)
                                    .insert(data)
                                    .returning(['user_id', 'first_name', 'last_name', 'email'])
        return result[0]
    }

    async findUser(id: number) {
        const result = await this.db.table(this.TABLE_NAME).where('user_id', id)
        return result[0]
    }

    async findUserByEmail(email: string) { 
        const result = await this.db.table(this.TABLE_NAME)
                                    .where('email', email)
        return result[0]
    }
}