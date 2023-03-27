import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
