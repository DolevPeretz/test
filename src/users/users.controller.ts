import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  allUsers() {
    return this.userService.getAllUser();
  }
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body.email, body.password);
  }
  @Delete('/:id')
  deletUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }
  @Patch('/:id')
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }
  @Get('import')
  importUsers() {
    return this.userService.importUsersFromExternalApi();
  }
}
