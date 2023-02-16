import { HttpException, HttpStatus, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2' //lib to hash password
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthRepository } from './auth.repository';
import { UserLoginInterface } from './dto';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService{

    constructor( private readonly jwt: JwtService, private readonly config: ConfigService, private repository: UserRepository) {
    }
    async signup(dto: AuthDto) { // do i need to refer to signTokenInterface and create it?
        const hash: string = await argon.hash(dto.password)
        const data: UserLoginInterface = {
            firstname: dto.firstname, 
            lastname: dto.lastname,
            email: dto.email,
            hash: hash
        }
        try{ 
            const user = await this.repository.signUp(data);  // do i need to refer what type of value (interface) need to contain this function from repo? 

            return this.signToken(user.user_id, user.email)
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
          }
    }

        async signin(dto: AuthDto) {
        const email = dto.email
        const user = await this.repository.findUserByEmail(email)

        if(!user) {
            throw new ForbiddenException('Credentials incorrect')
        }

        const passMatches = await argon.verify(user.hash, dto.password)

        if(!passMatches) {
            throw new ForbiddenException('Credentials incorrect')
        }
        return this.signToken(user.user_id, user.email)
    }

    async signToken(userId: number, email: string): Promise<object> {
        const payload = {
            sub: userId,
            email
        };
        const secret = this.config.get('JWT_SECRET') // need to get it from .env

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        })

        return {
            access_token: token
        }
    }

}