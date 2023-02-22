

import { IsEmail, IsNotEmpty, IsString } from "class-validator"

 export class MessageDto {
    @IsNotEmpty() 
    @IsString() 
    text: string;
}

export interface MessageInterface { 
    user_id: number,
    text: string,
    chat_id: number
}



import { PartialType } from "@nestjs/mapped-types";

export class UpdateMessageDto extends PartialType(MessageDto){}