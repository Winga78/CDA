import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';

export class CommentRepositoryMock {
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

describe('CommentService', () => {
  let commentsService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken (Comment),
          useClass: CommentRepositoryMock,
        }
      ],
    }).compile();
    commentsService = module.get<CommentsService>(CommentsService);
  });

 describe('findOneByCommentId',()=>{
  it('should return a comment if found', async ()=>{
    const comment = new Comment();
   comment.id = 1;
   comment.commentator = user;
   comment.name = 'testComment';

   comment.participants = [user]
   comment.createdAt = new Date(2025,3,6);
   comment.modifiedAt = new Date(2001,1,1);

    (commentsService as any).commentRepository.findOne.mockRejectedValueOnce(Comment);
    const foundComment = await commentsService.findOne(1)
    expect(foundComment).toEqual(comment)
  })

  it('should return undefined if comment not found', async () => {
    (CommentsService as any).commentRepository.findOne.mockResolvedValueOnce(
        undefined,
    );
    const foundUser = await commentsService.findOne(1);
    expect(foundUser).toBeUndefined();
});
 })


 describe('create', () => {
  it('should create a new comment if commentname is not already in use', async () => {
    const comment = new Comment();
   comment.id = 1;
   comment.commentator = user;
   comment.participants = [user];
   comment.name = 'testComment';
   comment.createdAt = new Date(2025,3,6);
   comment.modifiedAt = new Date(2025,3,6);

      (commentsService as any).commentRepository.findOne.mockResolvedValueOnce(
          undefined,
      );
      (commentsService as any).commentRepository.create.mockReturnValue(comment);
      const createdUser = await commentsService.create({
        id : 1,
        commentator : user,
        participants: [user],
        description : 'comment',
        name : 'testComment',
        createdAt : new Date(2025,3,6),
        modifiedAt : new Date(2001,1,1),
      });
      expect(createdUser).toEqual(Comment);
  });

  it('should throw a 400 error if commentname is already in use', async () => {
    const comment = new Comment();
   comment.id = 1;
   comment.commentator = user;
   comment.participants = [user];
   comment.name = 'testComment';
   comment.createdAt = new Date(2025,3,6);
   comment.modifiedAt = new Date(2001,1,1);
      
      (commentsService as any).commentRepository.findOne.mockResolvedValueOnce(
        comment,
      );
      await expect(
        commentsService.create({
          id : 1,
        commentator : user,
        participants: [user],
        description : 'comment',
        name : 'testComment',
        createdAt : new Date(2025,3,6),
        modifiedAt : new Date(2001,1,1),
          }),
      ).rejects.toThrowError(HttpException);
  });
});

describe('update', () => {
  it('should update comment information if comment exists', async () => {

    const existingComment = new Comment();
    existingComment.id = 1;
    existingComment.commentator = user;
    existingComment.participants= [user];
    existingComment.name = 'oldName';
    existingComment.createdAt = new Date(2022,3,6);
    existingComment.modifiedAt = new Date(2022,3,6);

    const updatedComment = { ...existingComment, name: 'newName', modifiedAt: new Date(2025,3,6) };

    (commentsService as any).commentRepository.findOne.mockResolvedValueOnce(existingComment);
    (commentsService as any).commentRepository.save.mockResolvedValueOnce(updatedComment);

    const result = await commentsService.update(1, {  name: 'newName', modifiedAt: new Date(2025,3,6) });

    expect(result).toEqual(updatedComment);
  });

  it('should throw a 404 error if comment does not exist', async () => {
    (commentsService as any).commentRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      commentsService.update(999, {  name: 'newName', modifiedAt: new Date(2025,3,6) })
    ).rejects.toThrowError(HttpException);
  });

});


describe('delete', () => {
  it('should delete a comment if comment exists', async () => {
    const commentToDelete = new Comment();
   commentToDelete.id = 1;
   commentToDelete.commentator = user;
   commentToDelete.name = 'testComment';
    commentToDelete.participants = [user],
   commentToDelete.createdAt = new Date(2025,3,6);
   commentToDelete.modifiedAt = new Date(2001,1,1);

    (commentsService as any).commentRepository.findOne.mockResolvedValueOnce(commentToDelete);
    (commentsService as any).commentRepository.remove.mockResolvedValueOnce(commentToDelete);

    const deletedUser = await commentsService.remove(1);

    expect(deletedUser).toEqual(commentToDelete);
  });

  it('should throw a 404 error if comment does not exist', async () => {
    (commentsService as any).commentRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      commentsService.remove(999) 
    ).rejects.toThrowError(HttpException);
  });
});


});
