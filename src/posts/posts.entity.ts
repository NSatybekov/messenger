import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ example: 'test posts text' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ example: 'test posts text' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class SearchPostDto {
  @ApiProperty({ example: 'any string to search' })
  @IsNotEmpty()
  @IsString()
  text: string;
}

export interface PostCreateInterface {
  user_id: number;
  text: string;
  name: string;
}

export interface PostInterface extends PostCreateInterface {
  post_id: number;
  created_at: Date;
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdatePostDto extends PartialType(PostDto) {
  @ApiProperty({ example: 'post text for update' })
  text?: string;

  @ApiProperty({ example: 'post name for update' })
  name?: string;
}
