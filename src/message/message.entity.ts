

import { IsEmail, IsNotEmpty, IsString } from "class-validator"

 export class MessageDto {
    @IsNotEmpty() 
    @IsString() 
    message_text: string;
}

export interface MessageInterface { 
    from_email: string,
    message_text: string,
}



import { PartialType } from "@nestjs/mapped-types";

export class UpdateMessageDto extends PartialType(MessageDto){}