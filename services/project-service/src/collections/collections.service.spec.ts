import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Collection } from './entities/collection.entity';
import { CollectionsService } from './collections.service';

export class userRepositoryMock {
  findOne = jest.fn();
  create = jest.fn();
  update = jest.fn();
  remove = jest.fn();
  findAll = jest.fn();
}

describe('UserService', () => {
  let collectionsService: CollectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionsService,
        {
          provide: getRepositoryToken (Collection),
          useClass: userRepositoryMock,
        }
      ],
    }).compile();
    collectionsService = module.get<CollectionsService>(CollectionsService);
  });

 describe('findOneByCollectionId',()=>{
  it('should return a user if found', async ()=>{
    const collection = new Collection();
    collection.id = 1;
    collection.user_id = '1';
    collection.name = 'testcollection';
    collection.createdAt = new Date(2025,3,6);
    collection.modifiedAt = new Date(2001,1,1);

    (collectionsService as any).userRepository.findOne.mockRejectedValueOnce(collection);
    const foundCollection = await collectionsService.findOne(1)
    expect(foundCollection).toEqual(collection)
  })

  it('should return undefined if user not found', async () => {
    (collectionsService as any).userRepository.findOne.mockResolvedValueOnce(
        undefined,
    );
    const foundUser = await collectionsService.findOne(1);
    expect(foundUser).toBeUndefined();
});
 })


 describe('create', () => {
  it('should create a new user if username is not already in use', async () => {
    const collection = new Collection();
    collection.id = 1;
    collection.user_id = '1';
    collection.name = 'testcollection';
    collection.createdAt = new Date(2025,3,6);
    collection.modifiedAt = new Date(2025,3,6);

      (collectionsService as any).userRepository.findOne.mockResolvedValueOnce(
          undefined,
      );
      (collectionsService as any).userRepository.create.mockReturnValue(collection);
      const createdUser = await collectionsService.create({
        id : 1,
        user_id : '1',
        name : 'testcollection',
        createdAt : new Date(2025,3,6),
        modifiedAt : new Date(2001,1,1),
      });
      expect(createdUser).toEqual(collection);
  });

  it('should throw a 400 error if username is already in use', async () => {
    const collection = new Collection();
    collection.id = 1;
    collection.user_id = '1';
    collection.name = 'testcollection';
    collection.createdAt = new Date(2025,3,6);
    collection.modifiedAt = new Date(2001,1,1);
      
      (collectionsService as any).userRepository.findOne.mockResolvedValueOnce(
        collection,
      );
      await expect(
        collectionsService.create({
          id : 1,
          user_id : '1',
          name : 'testcollection',
          createdAt : new Date(2025,3,6),
          modifiedAt : new Date(2001,1,1),
          }),
      ).rejects.toThrowError(HttpException);
  });
});

describe('update', () => {
  it('should update user information if user exists', async () => {

    const existingCollection = new Collection();
    existingCollection.id = 1;
    existingCollection.user_id = '1';
    existingCollection.name = 'oldName';
    existingCollection.createdAt = new Date(2022,3,6);
    existingCollection.modifiedAt = new Date(2022,3,6);

    const updatedCollection = { ...existingCollection, name: 'newName', modifiedAt: new Date(2025,3,6) };

    (collectionsService as any).userRepository.findOne.mockResolvedValueOnce(existingCollection);
    (collectionsService as any).userRepository.save.mockResolvedValueOnce(updatedCollection);

    const result = await collectionsService.update(1, {  name: 'newName', modifiedAt: new Date(2025,3,6) });

    expect(result).toEqual(updatedCollection);
  });

  it('should throw a 404 error if user does not exist', async () => {
    (collectionsService as any).userRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      collectionsService.update(999, {  name: 'newName', modifiedAt: new Date(2025,3,6) })
    ).rejects.toThrowError(HttpException);
  });

});


describe('delete', () => {
  it('should delete a user if user exists', async () => {
    const collectionToDelete = new Collection();
    collectionToDelete.id = 1;
    collectionToDelete.user_id = '1';
    collectionToDelete.name = 'testcollection';
    collectionToDelete.createdAt = new Date(2025,3,6);
    collectionToDelete.modifiedAt = new Date(2001,1,1);

    (CollectionsService as any).userRepository.findOne.mockResolvedValueOnce(collectionToDelete);
    (CollectionsService as any).userRepository.remove.mockResolvedValueOnce(collectionToDelete);

    const deletedUser = await collectionsService.remove(1);

    expect(deletedUser).toEqual(collectionToDelete);
  });

  it('should throw a 404 error if user does not exist', async () => {
    (collectionsService as any).userRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      collectionsService.remove(999) 
    ).rejects.toThrowError(HttpException);
  });
});


});
