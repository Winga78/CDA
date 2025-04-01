import { Controller, Get, Post, Body, Patch, Param, Delete , Request } from '@nestjs/common';
import { PostUserService } from './post-user.service';
import { CreatePostUserDto } from './dto/create-post-user.dto';

@Controller('post-user')
export class PostUserController {
  constructor(private readonly postUserService: PostUserService) {}

  @Post()
  create(@Body() createPostUserDto: CreatePostUserDto) {
    return this.postUserService.create(createPostUserDto);
  }

  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.postUserService.findAllVoteByPostId(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string ,@Request() req) {
    return this.postUserService.remove(+id,req.user.id);
  }
}
