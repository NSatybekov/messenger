import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { UserInterface, UserLoginInterface } from 'src/auth/dto';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({summary: 'Get all users list'})
  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({summary: 'Get info about you'})
  @UseGuards(JwtGuard)
  @Get('me') 
  findMe(@GetUser() user: UserInterface) {
    return this.usersService.findOne(user.user_id);
  }

  @ApiOperation({summary: 'Get info other user'})
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
}