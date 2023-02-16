import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UserLoginInterface } from "./dto";

@Injectable()
export class AuthRepository {  // need to change data from auth DTO to user interface fro entity, in DTO i'm getting password in entity i need to put hash that not exist in dto
    private readonly TABLE_NAME = 'users'
    constructor(@InjectModel() private readonly db: Knex) {}
    async signUp(data: UserLoginInterface) {
        const result = await this.db.table(this.TABLE_NAME)
                                    .insert(data)
                                    .returning(['user_id', 'firstname', 'lastname', 'email'])
        return result[0]
    }

    async findUserByEmail(email: string) {
        const result = await this.db.table(this.TABLE_NAME)
                                    .where('email', email)
                                    .returning(['user_id', 'firstname', 'lastname', 'email'])
        return result[0]
    }

}

//THIS MODULE IS NOT USING ANYMORE