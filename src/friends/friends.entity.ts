import { Timestamp } from "rxjs"
import { IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export type FriendRequestStatus = 'FRIEND' | 'BLOCKED' | 'SENT'



export interface FriendRequestInterface { 
    user_id: number,
    friend_id: number,
    friend_status: FriendRequestStatus
 }

 export interface FriendInterface extends FriendRequestInterface {
    created_at: Date
 }