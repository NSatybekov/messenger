import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy";
import { UserRepository } from "src/users/users.repository";

@Module({

    imports: [JwtModule.register({ })],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, UserRepository]
})


export class AuthModule {} 