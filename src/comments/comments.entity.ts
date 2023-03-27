import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ example: 'comments text' })
  @IsNotEmpty()
  @IsString()
  text: string;
}

export interface CommentCreateInterface {
  user_id: number;
  post_id: number;
  text: string;
}

export interface CommentInterface extends CommentCreateInterface {
  comment_id: number;
  created_at: Date;
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateCommentDto extends PartialType(CommentDto) {
  @ApiProperty({ example: 'Update comment text' })
  text?: string;
}
