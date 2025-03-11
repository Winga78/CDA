import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken  } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { HttpException } from '@nestjs/common';
export class userRepositoryMock {
  findOne = jest.fn();
  create = jest.fn();
  update = jest.fn();
  remove = jest.fn();
  findAll = jest.fn();
}

describe('UserService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken ('User'),
          useClass: userRepositoryMock,
        }
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
  });

 describe('findOneByUserId',()=>{
  it('should return a user if found', async ()=>{
    const user = new User();
    user.id = '1';
    user.firstname = 'testuser';
    user.lastname = 'testuser';
    user.password = 'password';
    user.birthday = new Date(2001,1,1);
    user.email = 'user01@gmail.com';
    user.role = 'user';

    (usersService as any).userRepository.findOne.mockRejectedValueOnce(user);
    const foundUser = await usersService.findOne('1')
    expect(foundUser).toEqual(user)
  })

  it('should return undefined if user not found', async () => {
    (usersService as any).userRepository.findOne.mockResolvedValueOnce(
        undefined,
    );
    const foundUser = await usersService.findOne('1');
    expect(foundUser).toBeUndefined();
});
 })


 describe('create', () => {
  it('should create a new user if username is not already in use', async () => {
    const user = new User();
    user.firstname = 'user001';
    user.lastname = 'testuser';
    user.password = 'password';
    user.birthday = new Date(2001,1,1);
    user.email = 'user001@gmail.com';
    user.role = 'user';
    user.createdAt = new Date(2025,3,6);

      (usersService as any).userRepository.findOne.mockResolvedValueOnce(
          undefined,
      );
      (usersService as any).userRepository.create.mockReturnValue(user);
      const createdUser = await usersService.create({
        firstname : 'user001',
        lastname : 'user001',
        password : 'password',
        birthday : new Date(2001,2,2),
        email : 'user001@gmail.com',
        role :'user',
        createdAt: new Date(2025,3,6)
      });
      expect(createdUser).toEqual(user);
  });

  it('should throw a 400 error if username is already in use', async () => {
      const user = new User();
      user.firstname = 'user001';
      user.lastname = 'testuser';
      user.password = 'password';
      user.birthday = new Date(2001,1,1);
      user.email = 'user001@gmail.com';
      user.role = 'user';
      user.createdAt = new Date(2025,3,6);
      
      (usersService as any).userRepository.findOne.mockResolvedValueOnce(
          user,
      );
      await expect(
          usersService.create({
            firstname : 'user001',
            lastname : 'user001',
            password : 'password',
            birthday : new Date(2001,2,2),
            email : 'user001@gmail.com',
            role :'user',
            createdAt: new Date(2025,3,6)
          }),
      ).rejects.toThrowError(HttpException);
  });
});

describe('update', () => {
  it('should update user information if user exists', async () => {
    const existingUser = new User();
    existingUser.id = '1';
    existingUser.firstname = 'oldName';
    existingUser.lastname = 'oldLastname';
    existingUser.password = 'oldPassword';
    existingUser.email = 'oldemail@gmail.com';
    existingUser.role = 'user';
    existingUser.birthday = new Date(2001,1,1);
    existingUser.createdAt = new Date(2025,3,6);

    const updatedUser = { ...existingUser, firstname: 'newName', lastname: 'newLastname' };

    (usersService as any).userRepository.findOne.mockResolvedValueOnce(existingUser);
    (usersService as any).userRepository.save.mockResolvedValueOnce(updatedUser);

    const result = await usersService.update('1', { firstname: 'newName', lastname: 'newLastname' });

    expect(result).toEqual(updatedUser);
  });

  it('should throw a 404 error if user does not exist', async () => {
    (usersService as any).userRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      usersService.update('999', { firstname: 'newName', lastname: 'newLastname' })
    ).rejects.toThrowError(HttpException);
  });

});


describe('delete', () => {
  it('should delete a user if user exists', async () => {
    const userToDelete = new User();
    userToDelete.id = '1';
    userToDelete.firstname = 'testuser';
    userToDelete.lastname = 'user01';

    (usersService as any).userRepository.findOne.mockResolvedValueOnce(userToDelete);
    (usersService as any).userRepository.remove.mockResolvedValueOnce(userToDelete);

    const deletedUser = await usersService.remove('1');

    expect(deletedUser).toEqual(userToDelete);
  });

  it('should throw a 404 error if user does not exist', async () => {
    (usersService as any).userRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      usersService.remove('999') 
    ).rejects.toThrowError(HttpException);
  });
});


});
