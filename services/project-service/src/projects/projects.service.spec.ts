import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

export class ProjectRepositoryMock {
  findOne = jest.fn();
  create = jest.fn();
  update = jest.fn();
  remove = jest.fn();
  findAll = jest.fn();
}
const user = {
  firstname : 'user001',
  lastname : 'user001',
  password : 'password',
  birthday : new Date(2001,2,2),
  email : 'user001@gmail.com',
  role :'user',
  createdAt: new Date(2025,3,6)
}

describe('ProjectService', () => {
  let projectsService: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken (Project),
          useClass: ProjectRepositoryMock,
        }
      ],
    }).compile();
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

 describe('findOneByProjectId',()=>{
  it('should return a user if found', async ()=>{
    const project = new Project();
   project.id = 1;
   project.user_id = '1';
   project.name = 'testProject';
   project.collection = {
    id : 1,
    user_id :'1',
    name : 'testcollection',
    createdAt : new Date(2025,3,6),
    modifiedAt : new Date(2001,1,1),
   };
   project.participants = [user]
   project.createdAt = new Date(2025,3,6);
   project.modifiedAt = new Date(2001,1,1);

    (projectsService as any).userRepository.findOne.mockRejectedValueOnce(Project);
    const foundProject = await projectsService.findOne(1)
    expect(foundProject).toEqual(project)
  })

  it('should return undefined if user not found', async () => {
    (ProjectsService as any).userRepository.findOne.mockResolvedValueOnce(
        undefined,
    );
    const foundUser = await projectsService.findOne(1);
    expect(foundUser).toBeUndefined();
});
 })


 describe('create', () => {
  it('should create a new user if username is not already in use', async () => {
    const project = new Project();
   project.id = 1;
   project.user_id = '1';
   project.collection = {
    id : 1,
          user_id : '1',
          name : 'testcollection',
          createdAt : new Date(2025,3,6),
          modifiedAt : new Date(2001,1,1),
   };
   project.participants = [user];
   project.name = 'testProject';
   project.createdAt = new Date(2025,3,6);
   project.modifiedAt = new Date(2025,3,6);

      (projectsService as any).userRepository.findOne.mockResolvedValueOnce(
          undefined,
      );
      (projectsService as any).userRepository.create.mockReturnValue(project);
      const createdUser = await projectsService.create({
        id : 1,
        collection:{
          id : 1,
          user_id : '1',
          name : 'testcollection',
          createdAt : new Date(2025,3,6),
          modifiedAt : new Date(2001,1,1),
          },
        user_id : '1',
        participants: ['1'],
        description : 'project',
        name : 'testProject',
        createdAt : new Date(2025,3,6),
        modifiedAt : new Date(2001,1,1),
      });
      expect(createdUser).toEqual(Project);
  });

  it('should throw a 400 error if username is already in use', async () => {
    const project = new Project();
   project.id = 1;
   project.user_id = '1';
    project.collection = {
      id : 1,
          user_id : '1',
          name : 'testcollection',
          createdAt : new Date(2025,3,6),
          modifiedAt : new Date(2001,1,1),
    };
   project.participants = [user];
   project.name = 'testProject';
   project.createdAt = new Date(2025,3,6);
   project.modifiedAt = new Date(2001,1,1);
      
      (projectsService as any).userRepository.findOne.mockResolvedValueOnce(
        project,
      );
      await expect(
        projectsService.create({
          id : 1,
        collection:{
          id : 1,
          user_id : '1',
          name : 'testcollection',
          createdAt : new Date(2025,3,6),
          modifiedAt : new Date(2001,1,1),
          },
        user_id :'1',
        participants: ['1'],
        description : 'project',
        name : 'testProject',
        createdAt : new Date(2025,3,6),
        modifiedAt : new Date(2001,1,1),
          }),
      ).rejects.toThrowError(HttpException);
  });
});

describe('update', () => {
  it('should update user information if user exists', async () => {

    const existingProject = new Project();
    existingProject.id = 1;
    existingProject.user_id = '1';
    existingProject.collection = {
      id : 1,
          user_id : '1',
          name : 'testcollection',
          createdAt : new Date(2025,3,6),
          modifiedAt : new Date(2001,1,1),
    };
    existingProject.participants= [user];
    existingProject.name = 'oldName';
    existingProject.createdAt = new Date(2022,3,6);
    existingProject.modifiedAt = new Date(2022,3,6);

    const updatedProject = { ...existingProject, name: 'newName', modifiedAt: new Date(2025,3,6) };

    (projectsService as any).userRepository.findOne.mockResolvedValueOnce(existingProject);
    (projectsService as any).userRepository.save.mockResolvedValueOnce(updatedProject);

    const result = await projectsService.update(1, {  name: 'newName', modifiedAt: new Date(2025,3,6) });

    expect(result).toEqual(updatedProject);
  });

  it('should throw a 404 error if user does not exist', async () => {
    (projectsService as any).userRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      projectsService.update(999, {  name: 'newName', modifiedAt: new Date(2025,3,6) })
    ).rejects.toThrowError(HttpException);
  });

});


describe('delete', () => {
  it('should delete a user if user exists', async () => {
    const projectToDelete = new Project();
   projectToDelete.id = 1;
   projectToDelete.user_id = '1';
   projectToDelete.name = 'testProject';
   projectToDelete.collection = {
    id : 1,
    user_id : '1',
    name : 'testcollection',
    createdAt : new Date(2025,3,6),
    modifiedAt : new Date(2001,1,1),
    },
    projectToDelete.participants = [user],
   projectToDelete.createdAt = new Date(2025,3,6);
   projectToDelete.modifiedAt = new Date(2001,1,1);

    (projectsService as any).userRepository.findOne.mockResolvedValueOnce(projectToDelete);
    (projectsService as any).userRepository.remove.mockResolvedValueOnce(projectToDelete);

    const deletedUser = await projectsService.remove(1);

    expect(deletedUser).toEqual(projectToDelete);
  });

  it('should throw a 404 error if user does not exist', async () => {
    (projectsService as any).userRepository.findOne.mockResolvedValueOnce(undefined);

    await expect(
      projectsService.remove(999) 
    ).rejects.toThrowError(HttpException);
  });
});


});
