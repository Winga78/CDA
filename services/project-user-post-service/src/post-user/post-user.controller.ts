import { Controller, Get, Post, Body, Param, Delete, Request, UnauthorizedException } from '@nestjs/common';
import { PostUserService } from './post-user.service';
import { CreatePostUserDto } from './dto/create-post-user.dto';

@Controller('post-user')
export class PostUserController {
  constructor(private readonly postUserService: PostUserService) {}

  @Post()
  create(@Body() createPostUserDto: CreatePostUserDto) {
    return this.postUserService.create(createPostUserDto);
  }

  @Get('notification/posts/details')
  findNotification(@Request() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant ou invalide');
    }

    const token = authHeader.split(' ')[1];
    const user_connected = req.user.id;

    return this.postUserService.notificationPost(user_connected, token);
  }

  @Get('votes/:post_id')
  findAll(@Param('post_id') postId: string) {
    return this.postUserService.findAllVoteByPostId(+postId);
  }

  @Get('vote/:post_id/:user_id')
  checkVote(@Param('post_id') postId: string, @Param('user_id') userId: string) {
    return this.postUserService.findVoteCheck(+postId, userId);
  }

  @Delete('vote/:post_id/:user_id')
  remove(@Param('post_id') postId: string, @Param('user_id') userId: string) {
    return this.postUserService.remove(+postId, userId);
  }
}
