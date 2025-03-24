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

  @Get()
  findAll(@Body() body:{ id: number}) {
    return this.postUserService.findAllVoteByPostId(body.id);
  }

  @Delete()
  remove(@Body() body:{ id: number} ,@Request() req) {
    return this.postUserService.remove(body.id, req.user.id);
  }
}
