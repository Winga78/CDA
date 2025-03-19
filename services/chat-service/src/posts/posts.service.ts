import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository, UpdateResult } from 'typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) { }

  async create(user:any, createPostDto: CreatePostDto) : Promise<Post> {
    
        const createPost : CreatePostDto = {
          user_id : user.id,
          project_id : createPostDto.project_id,
          titre : createPostDto.titre,
          description : createPostDto.description,
          createdAt : new Date(),
          modifiedAt : new Date()
        }

    return await this.postRepo.save(createPost);
  }

  async findAll() : Promise<Post[]>{
    return await this.postRepo.find();
  }

  async findOne(id: number) : Promise<Post | null>{
    const post = await this.postRepo.findOneBy({id : id});
    if(!post)
      throw new NotFoundException('Aucun post trouvé pour cet ID')
    return post
  }


  async findOneByProjectId(id: number) : Promise<Post | null>{
    const post = await this.postRepo.findOneBy({project_id : id});
    if(!post)
      throw new NotFoundException('Aucun post trouvé pour cet ID')
    return post
  }
  //Update des participants qui ont voté pour le poste
  async update(id: number, updatePostDto: UpdatePostDto) : Promise<UpdateResult> {
    const updatePost = await this.postRepo.update(id, updatePostDto);
    if (!updatePost)
      throw new NotFoundException('Impossible de mettre à jour, poste non trouvé');
    return updatePost
  }

  async remove(id: number) : Promise<{message : string}> {
    const post= await this.postRepo.delete({ id: id });
    if (!post)
      throw new NotFoundException('Impossible de supprimer, poste non trouvé');
    return {message : 'poste supprimé avec succès'}
  }
}
