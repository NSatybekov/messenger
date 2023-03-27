import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//  export class AuthDto {
//     @IsNotEmpty()
//     @IsString()
//     first_name: string;

//     @IsNotEmpty()
//     @IsString()
//     last_name: string;

//     @IsNotEmpty()
//     @IsEmail()
//     email: string;

//     @IsNotEmpty()
//     @IsString()
//     password: string;

// }

export class SignInDto {
  @ApiProperty({ example: 'test1@test.ru' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignUpDto extends SignInDto {
  @ApiProperty({ example: 'Nuradil' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Satybekov' })
  @IsNotEmpty()
  @IsString()
  last_name: string;
}

export interface UserLoginInterface {
  first_name: string;
  last_name: string;
  email: string;
  hash: string;
}

export interface UserInterface extends UserLoginInterface {
  user_id: number;
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(SignUpDto) {}
