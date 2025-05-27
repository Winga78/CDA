import { ConflictException, Injectable , NotFoundException} from '@nestjs/common';
import { CreatePostUserDto } from './dto/create-post-user.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository , DataSource} from 'typeorm';
import { PostUser } from './entities/post-user.entity';
import { ProjectUser } from '../project-user/entities/project-user.entity';
import axios from 'axios';

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
  
    async notificationPost(user_id: string, token: string) {
      if (!token) {
        throw new Error('Authorization token manquant');
      }

      let notif_info: any = [];
    
      const infos = await this.postsUsersRepository
        .createQueryBuilder('post_user')
        .select([
          'post_user.participant_id AS post_user_id',
          'post_user.post_id AS post_id',
          'project_user.project_id AS project_id',
          'project_user.participant_id AS project_user_id',
          'post_user.createdAt AS createdAt',
          'post_user.modifiedAt AS modifiedAt'
        ])
        .innerJoin(ProjectUser, 'project_user', 'post_user.participant_id = project_user.participant_id')
        .where('project_user.participant_id = :user_id', { user_id })
        .orderBy('post_user.createdAt', 'DESC')
        .getRawMany();
    
      const project_uri = process.env.VITE_PROJECT_SERVICE_URL || "http://localhost:3002/projects";
      const user_uri = process.env.VITE_AUTH_SERVICE_URL || "http://localhost:3000/users";

      const notifications = await Promise.all(
        infos.map(async (p) => {
          try {
            const userResponse = await axios.get(`${user_uri}/${p.post_user_id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
    
            const projectResponse = await axios.get(`${project_uri}/${p.project_id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
    
            // Fusionner les données et les ajouter à notif_info
            notif_info.push({
              user: userResponse.data,
              project: projectResponse.data,
            });
    
          } catch (err) {
            console.error(`Erreur pour l'utilisateur ${p.post_user_id} :`, err);
            return null;
          }
        })
      );
      return notif_info;
    }
    
}
