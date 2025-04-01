import { Controller, Get, HttpCode,HttpStatus,Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from './auth.decorator';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @Post('other')
  @HttpCode(HttpStatus.OK)
  findOneByEmail(@Body() body: { email: string }) {
    const {email} = body
    return this.usersService.findOneByEmail(email);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  remove(@Request() req) {
    return this.usersService.remove(req.user.id);
  }
}
