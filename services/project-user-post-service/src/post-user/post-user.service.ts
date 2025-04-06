import { ConflictException, Injectable , NotFoundException} from '@nestjs/common';
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

    async create(createPostUserDto: CreatePostUserDto) {
      const vote = await this.postsUsersRepository.findOneBy({
          post_id: createPostUserDto.post_id,
          participant_id: createPostUserDto.participant_id,
      });
  
      if (vote) {
          throw new ConflictException('Vote déjà effectué');
      }
  
      return this.postsUsersRepository.save(createPostUserDto);
    }
  
    async findAllVoteByPostId(id: number) : Promise<{count : number}>{
      const count = await this.postsUsersRepository.count({ where: { post_id: id } });
      return {count : count}
    }
  
    async findVoteCheck(id: number, participant_id: string) {
      return await this.postsUsersRepository.findOneBy({
          post_id: id,
          participant_id: participant_id,
      });
    }
  
    async remove(post_id: number, user_id: string) {
      const postUser = await this.postsUsersRepository.findOneBy({
          post_id: post_id,
          participant_id: user_id,
      });
  
      if (!postUser) {
          throw new NotFoundException("Vote non trouvé");
      }
  
      await this.postsUsersRepository.delete({ post_id, participant_id: user_id });
  
      return {message : 'Vote supprimé avec succès'};
    }
  
}
