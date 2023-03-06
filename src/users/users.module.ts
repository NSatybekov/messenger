import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  providers: [UsersService, UserRepository, RedisModule],
  controllers: [UsersController],
  imports: [RedisModule]
})
export class UsersModule {}
