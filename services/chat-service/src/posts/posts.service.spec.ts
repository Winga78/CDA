import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

export class PostRepositoryMock {
  findOne = jest.fn();
  create = jest.fn();
  update = jest.fn();
  remove = jest.fn();
  findAll = jest.fn();
}
const user = {
  firstname : 'user',
  lastname : 'user',
  password : 'password',
  birthday : new Date(2001,2,2),
  email : 'user@gmail.com',
  role :'user',
  createdAt: new Date(2025,3,6)
}

const project = {
  id : 1,
  collection:{
    id : 1,
    user_id : user,
    name : 'testcollection',
    createdAt : new Date(2025,3,6),
    modifiedAt : new Date(2001,1,1),
    },
  user_id : user,
  participants: [user],
  description : 'project',
  name : 'testProject',
  createdAt : new Date(2025,3,6),
  modifiedAt : new Date(2001,1,1),
}

describe('PostService', () => {
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken (Post),
          useClass: PostRepositoryMock,
        }
      ],
    }).compile();
    postsService = module.get<PostsService>(PostsService);
  });

 describe('findOneByPostId',()=>{
  it('should return a post if found', async ()=>{
    const post = new Post();
   post.id = 1;
   post.user_id = user;
   post.description = 'testPost';
   post.titre= 'post';
   post.project_id = project;
   post.participants = [user]
   post.createdAt = new Date(2025,3,6);
   post.modifiedAt = new Date(2001,1,1);

    (postsService as any).postRepository.findOne.mockRejectedValueOnce(Post);
    const foundPost = await postsService.findOne(1)
    expect(foundPost).toEqual(post)
  })

  it('should return undefined if post not found', async () => {
    (PostsService as any).postRepository.findOne.mockResolvedValueOnce(
        undefined,
    );
    const foundUser = await postsService.findOne(1);
    expect(foundUser).toBeUndefined();
});
 })


 describe('create', () => {
  it('should create a new post if postname is not already in use', async () => {
    const post = new Post();
    post.id = 1;
    post.user_id = user;
    post.description = 'testPost';
    post.titre= 'post';
    post.project_id = project;
    post.participants = [user]
    post.createdAt = new Date(2025,3,6);
    post.modifiedAt = new Date(2001,1,1);

      (postsService as any).postRepository.findOne.mockResolvedValueOnce(
          undefined,
      );
      (postsService as any).postRepository.create.mockReturnValue(post);
      const createdUser = await postsService.create({
        id : 1,
        user_id : user,
        participants: [user],
        description : 'post',
        project_id: project,
        titre : 'titre',
        createdAt : new Date(2025,3,6),
        modifiedAt : new Date(2001,1,1),
      });
      expect(createdUser).toEqual(Post);
  });

  it('should throw a 400 error if postname is already in use', async () => {
    const post = new Post();
   post.id = 1;
   post.user_id = user;
   post.participants = [user];
   post.description = 'testPost';
   post.createdAt = new Date(2025,3,6);
   post.modifiedAt = new Date(2001,1,1);
   post.titre = 'titre';
   post.project_id = project;
      
      (postsService as any).postRepository.findOne.mockResolvedValueOnce(
        post,
      );
      await expect(
        postsService.create({
          id : 1,
        user_id : user,
        participants: [user],
        description : 'post',
        titre : 'titre',
        project_id: project,
        createdAt : new Date(2025,3,6),
        modifiedAt : new Date(2001,1,1),
          }),
      ).rejects.toThrowError(HttpException);
  });
});

describe('update', () => {
  it('should update post information if post exists', async () => {

    const existingPost = new Post();
    existingPost.id = 1;
    existingPost.user_id = user;
    existingPost.participants= [user];
    existingPost.description = 'oldName';
    existingPost.createdAt = new Date(2022,3,6);
    existingPost.titre = 'titre';
    existingPost.project_id = project;
    existingPost.modifiedAt = new Date(2022,3,6);

    const updatedPost = { ...existingPost, name: 'newName', modifiedAt: new Date(2025,3,6) };

    (postsService as any).postRepository.findOne.mockResolvedValueOnce(existingPost);
    (postsService as any).postRepository.save.mockResolvedValueOnce(updatedPost);

    const result = await postsService.update(1, {  titre: 'newName', modifiedAt: new Date(2025,3,6) });

    expect(result).toEqual(updatedPost);
  });

  it('should throw a 404 error if post does not exist', async () => {
    (postsService as any).postRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      postsService.update(999, {  titre: 'newName', modifiedAt: new Date(2025,3,6) })
    ).rejects.toThrowError(HttpException);
  });

});


describe('delete', () => {
  it('should delete a post if post exists', async () => {
    const postToDelete = new Post();
   postToDelete.id = 1;
   postToDelete.user_id = user;
   postToDelete.description = 'testPost';
    postToDelete.participants = [user],
    postToDelete.titre = 'titre'
   postToDelete.createdAt = new Date(2025,3,6);
   postToDelete.modifiedAt = new Date(2001,1,1);

    (postsService as any).postRepository.findOne.mockResolvedValueOnce(postToDelete);
    (postsService as any).postRepository.remove.mockResolvedValueOnce(postToDelete);

    const deletedUser = await postsService.remove(1);

    expect(deletedUser).toEqual(postToDelete);
  });

  it('should throw a 404 error if post does not exist', async () => {
    (postsService as any).postRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      postsService.remove(999) 
    ).rejects.toThrowError(HttpException);
  });
});


});
