import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports , api_auth } from './constants';
import { faker } from '@faker-js/faker';
import { CreateProjectDto } from '../src/projects/dto/create-project.dto';
import { Project } from '../src/projects/entities/project.entity';
import axios from 'axios';

let dataSource: DataSource;
let app: INestApplication;
let token: any;
let userConnected: any;

beforeAll(async () => {
  // Database setup
  dataSource = new DataSource({
    type: 'mysql',
    host: database.host,
    port: parseInt(database.port),
    username: database.username,
    password: database.password,
    database: database.database,
    entities: [Project],
    synchronize: true,
    dropSchema: true,
  });

  await dataSource.initialize();

  const moduleFixture: TestingModule = await Test.createTestingModule({ imports }).compile();
  app = moduleFixture.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await Promise.all([dataSource.destroy(), app.close()]);
});

const createUser = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
  role: 'user',
  createdAt: faker.date.soon({ refDate: '2023-01-01T00:00:00.000Z' }),
};

const createProject: CreateProjectDto = {
  user_id: userConnected?.id,
  name: faker.lorem.words(3),
  description: faker.lorem.sentence(),
  createdAt: new Date(),
  modifiedAt: new Date(),
};

const apiUrl = api_auth || 'http://localhost:3000';


describe('Projects Endpoints (e2e)', () => {
  beforeAll(async () => {
    const createUserResponse = await axios.post(`http://localhost:3000/users`, createUser);
    const loginRes = await axios.post(`http://localhost:3000/auth/login`, { email: createUserResponse.data.email, password: createUser.password });

    token = loginRes.data.access_token;

    const userProfile = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer ${token}`);
    userConnected = userProfile.body;
  });

  describe('POST /projects', () => {
    it('should create a project', async () => {
      const res = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(createProject);

      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('user_id');
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('description');
    });

    it('should not create project without authentication', async () => {
      const res = await request(app.getHttpServer()).post('/projects').send(createProject);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });
  });

  describe('PATCH /projects/:id', () => {
    let project: any;
    let users_participants: any[] = [];

    const newProject: CreateProjectDto = {
      user_id: userConnected?.id,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    beforeAll(async () => {
      const resProject = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(newProject);

      project = resProject.body;

      users_participants = Array.from({ length: 5 }, () => ({ email: faker.internet.email() }));
    });

    it('should update a project', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/projects/${project.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...project, participants: users_participants });

      expect(res.statusCode).toBe(200);

      const resPro = await request(app.getHttpServer())
        .get(`/projects/${project.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(resPro.statusCode).toBe(200);
      expect(resPro.body.participants).toHaveLength(5);
    });

    it('should not update project when not found', async () => {
      const res = await request(app.getHttpServer())
        .patch('/projects/8888')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...project, participants: users_participants });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Impossible de mettre à jour, projet non trouvé');
    });

    it('should not update project without authentication', async () => {
      const res = await request(app.getHttpServer()).patch(`/projects/${project.id}`).send(createProject);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not update project with invalid token', async () => {
      const res = await request(app.getHttpServer()).patch(`/projects/${project.id}`).set('Authorization', 'Bearer invalid-token');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });
  });

  describe('GET /projects', () => {
    it('should return all projects', async () => {
      const res = await request(app.getHttpServer()).get('/projects').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /projects/:id', () => {
    let project: any;
    
    const newProject: CreateProjectDto = {
      user_id: userConnected?.id,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    beforeAll(async () => {
      const resProject = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(newProject);

      project = resProject.body;
    });

    it('should return a single project', async () => {
      const res = await request(app.getHttpServer()).get(`/projects/${project.id}`).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', project.id);
    });

    it('should return 404 when ID does not exist', async () => {
      const res = await request(app.getHttpServer()).get('/projects/565').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Aucun project trouvé pour cette id');
    });

    it('should not return project without authentication', async () => {
      const res = await request(app.getHttpServer()).get(`/projects/${project.id}`);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not return project with invalid token', async () => {
      const res = await request(app.getHttpServer()).get(`/projects/${project.id}`).set('Authorization', 'Bearer invalid-token');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });
  });

  describe('DELETE /projects/:id', () => {
    let project: any;

    const newProject : CreateProjectDto = {
      user_id: userConnected?.id,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    beforeAll(async () => {
      const resProject = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(newProject);

      project = resProject.body;
    });

    it('should delete a project', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/projects/${project.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
    });

    it('should return 404 when project ID does not exist', async () => {
      const res = await request(app.getHttpServer()).delete(`/projects/6545`).set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Impossible de supprimer, projet non trouvé');
    });

    it('should not delete project without authentication', async () => {
      const res = await request(app.getHttpServer()).delete(`/projects/${project.id}`);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not delete project with invalid token', async () => {
      const res = await request(app.getHttpServer()).delete(`/projects/${project.id}`).set('Authorization', 'Bearer invalid-token');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });
  });
});
