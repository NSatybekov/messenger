import { Timestamp } from "rxjs"
import { IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from "@nestjs/swagger"



export enum RoleEnum {
   Member = 'member',
   Admin = 'admin',
 }

 export type Role = RoleEnum.Member | RoleEnum.Admin
 
export class RoleDTO{
   @IsEnum(RoleEnum, { message: 'Invalid role type' })
   @IsNotEmpty()
   role: Role;
}

 export class ChatMemberDTO extends RoleDTO{
   @ApiProperty({example: 'any number from users list'})
   @IsNotEmpty()
   user_id: number;


   chat_id?: number
 
 }

 // HOW TO COMBINE ROLES, ENUMS, DTOS, GENERICSS 
 // i just tried different things and its got problems

export interface ChatMemberCreateInterface<Role = RoleEnum.Member | RoleEnum.Admin> { 
    user_id: number,
    chat_id: number,
    role?: Role | 'member' | 'admin'
 }

 export interface ChatMemberInterface extends ChatMemberCreateInterface {
    created_at: Date,
    left_at?: Date
 }