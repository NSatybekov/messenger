import {IsNotEmpty, IsString } from "class-validator"

export class ChatNameDto {
   @IsNotEmpty() 
   @IsString() 
   chat_name: string;
}

export interface ChatInterface { 
   chat_name: string,
   admin_id: number
}



import { PartialType } from "@nestjs/mapped-types";

export class UpdateMessageDto extends PartialType(ChatNameDto){}