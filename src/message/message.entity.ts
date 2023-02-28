

import { IsEmail, IsNotEmpty, IsString } from "class-validator"

 export class MessageDto {
    @IsNotEmpty() 
    @IsString() 
    text: string;
}

export interface MessageCreateInterface { 
    user_id: number,
    text: string,
    chat_id: number
}

export interface MessageInterface extends MessageCreateInterface {
    message_id: number,
    created_at: Date
}

import { PartialType } from "@nestjs/mapped-types";

export class UpdateMessageDto extends PartialType(MessageDto){}