import { Controller, Get, HttpCode,HttpStatus,Post, Body, Patch, Param, Delete, Request, ParseFilePipeBuilder,UploadedFile,UseInterceptors} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from './auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Get('/other/:id')
  @HttpCode(HttpStatus.OK)
  findOneByEmail(@Param('id') email : string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/users/avatars',
      filename: (req, file, callback) => {
        const name = `${Date.now()}${extname(file.originalname)}`;
        callback(null, name);
      },
    }),
  }))

  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(
    @Request() req, 
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    if (file) {
      const avatarPath = `uploads/users/avatars/${file.filename}`;
      updateUserDto.avatar = avatarPath;
    }

    return await this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  remove(@Request() req) {
    return this.usersService.remove(req.user.id);
  }
}
