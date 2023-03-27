import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatNameDto {
  @ApiProperty({ example: 'First Chat' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export interface ChatRegistryInterface {
  name: string;
}

export interface ChatInterface extends ChatRegistryInterface {
  chat_id: number;
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateMessageDto extends PartialType(ChatNameDto) {}
