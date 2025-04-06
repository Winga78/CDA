import { Controller, Get, Post, Body, Patch, Param, Delete , Request , UnauthorizedException} from '@nestjs/common';
import { PostUserService } from './post-user.service';
import { CreatePostUserDto } from './dto/create-post-user.dto';

@Controller('post-user')
export class PostUserController {
  constructor(private readonly postUserService: PostUserService) {}

  @Post()
  create(@Body() createPostUserDto: CreatePostUserDto) {
    return this.postUserService.create(createPostUserDto);
  }

  @Get('/notification/posts/details/')
  findNotification(@Request() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token manquant ou invalide');
    }
  
    const token = authHeader.split(' ')[1];
    const user_connected = req.user.id;

    return this.postUserService.notificationPost(user_connected, token);
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
