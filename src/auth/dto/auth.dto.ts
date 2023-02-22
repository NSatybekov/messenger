import { IsEmail, IsNotEmpty, IsString } from "class-validator"

 export class AuthDto {
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty() 
    @IsEmail() 
    email: string;

    @IsNotEmpty() 
    @IsString() 
    password: string;

}

export interface UserLoginInterface { 
    first_name: string,
    last_name: string,
    email: string,
    hash: string
}

export interface UserInterface extends UserLoginInterface {
    user_id: number
}

import { PartialType } from "@nestjs/mapped-types";

export class UpdateUserDto extends PartialType(AuthDto){}