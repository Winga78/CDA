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

  @Get(':id/:user_id')
  checkVote(@Param('id') id: string, @Param('user_id') user_id: string) {
    return this.postUserService.findVoteCheck(+id , user_id);
  }

  @Delete(':id/:user_id')
  remove(@Param('id') id: string, @Param('user_id') user_id: string ) {
      return this.postUserService.remove(+id, user_id);
  }
  
}
