import { HttpException, HttpStatus, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2' //lib to hash password
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SignInDto, SignUpDto, UserLoginInterface } from './dto';
import { UserRepository } from 'src/users/users.repository';
import * as faker from 'faker'

@Injectable()
export class AuthService{

    constructor( private readonly jwt: JwtService, 
                 private readonly config: ConfigService,
                 private repository: UserRepository) {
    }

  async createRandomUsers(): Promise<void> {
    for (let i = 0; i < 100; i++) {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email(firstName, lastName);
      const password = faker.internet.password();

      const dto: SignUpDto = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      };

      await this.signup(dto);
    }
  }
    async signup(dto: SignUpDto) { // do i need to refer to signTokenInterface and create it?
        const hash: string = await argon.hash(dto.password)
        const data: UserLoginInterface = {
            first_name: dto.first_name, 
            last_name: dto.last_name,
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

        async signin(dto: SignInDto) {
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
            expiresIn: '1000 years',
            secret: secret
        })

        return {
            access_token: token
        }
    }

}