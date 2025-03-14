import { Injectable , NotFoundException , ConflictException , BadRequestException} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository , UpdateResult} from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { userProfile } from '../profils.utils';

@Injectable()
export class CommentsService {
    constructor(
      @InjectRepository(Comment)
      private readonly commentRepo: Repository<Comment>,
      private readonly httpService: HttpService
    ) { }

  async create(authHeader : string, createCommentDto: CreateCommentDto) : Promise<Comment>{
    // Récupérer le socket envoyer par le frontend
 
    const user = await userProfile(this.httpService, authHeader);

    const createComment : CreateCommentDto = {
      commentator : user.id,
      po_id : createCommentDto.po_id,
      participants : createCommentDto.participants,
      name : createCommentDto.name,
      description : createCommentDto.description,
      createdAt : new Date(),
      modifiedAt : new Date()
    }
    
    return await this.commentRepo.save(createComment);
  }

  // créer une méthode pour récupérer les commentaires de la base de donnée et l'envoyer en socket

  async findAll() : Promise<Comment[]> {
    return await this.commentRepo.find();
  }

  async findOne(id: number) : Promise<Comment | null>{
    const comment = await this.commentRepo.findOneBy({id : id});
    if (!comment)
      throw new NotFoundException('Utiliateur non trouvé')

    return comment;
  }

  async update(updateCommentDto: UpdateCommentDto): Promise<UpdateResult> {
    if (!updateCommentDto.id) {
      throw new BadRequestException("L'ID du commentaire est requis");
    }

    const existingComment = await this.commentRepo.findOneBy({ id: updateCommentDto.id });
    if (!existingComment) {
      throw new NotFoundException('Impossible de mettre à jour, commentaire non trouvé');
    }

    return await this.commentRepo.update(updateCommentDto.id, updateCommentDto);
  }

  async remove(id: number) : Promise<{message : string}> {
   const comment = await this.commentRepo.delete({id : id});
   if (!comment)
    throw new NotFoundException('Impossible de supprimer, commentaire non trouvé');
   return {message : 'Commentaire supprimé avec succès'}
  }

  async findOneByPostId(post_id: Post): Promise<Comment> {
    const comment = await this.commentRepo.findOneBy({ po_id: post_id });

    if (!comment) {
      throw new NotFoundException("Aucun commentaire trouvé pour ce post");
    }

    return comment;
  }

}
