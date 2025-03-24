import { Injectable} from '@nestjs/common';
import { CreatePostUserDto } from './dto/create-post-user.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { PostUser } from './entities/post-user.entity';

@Injectable()
export class PostUserService {
    constructor(
      @InjectRepository(PostUser)
      private postsUsersRepository: Repository<PostUser>,
    ) {}

  create(createPostUserDto: CreatePostUserDto) {
    return this.postsUsersRepository.save(createPostUserDto);
  }

  async findAllVoteByPostId(id : number) {
    return await this.postsUsersRepository.findAndCountBy({post_id : id })
  }

  async remove(post_id: number , user_id : string) {
    const postUser = await this.postsUsersRepository.findOneBy({
      post_id: post_id,
      participant_id: user_id
  });
  return { message: 'Vote supprimé avec succès' };
  }
}
