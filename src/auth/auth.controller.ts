import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {  SignInDto, SignUpDto } from "./dto";


@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: SignUpDto) {
        return this.authService.signup(dto)
    }

    @HttpCode(HttpStatus.OK) // needs to change http code that returns to user
    @Post('signin')
    signin(@Body() dto: SignInDto) {
        return this.authService.signin(dto)
    }
}