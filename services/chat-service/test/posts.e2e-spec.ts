import { INestApplication, HttpStatus, Body } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports , api_auth, api_project } from './constants';
import { faker } from '@faker-js/faker';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { Post } from '../src/posts/entities/post.entity';
import axios from 'axios';

let dataSource: DataSource;
let app: INestApplication;
let token: any;
let userConnected: any;
let project: any;
let mypost:CreatePostDto;
let createPost:CreatePostDto;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'mysql',
    host: database.host,
    port: parseInt(database.port),
    username: database.username,
    password: database.password,
    database: database.database,
    entities: [Post],
    synchronize: true,
    dropSchema: true,
  });

  await dataSource.initialize();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports,
  }).compile();

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

const createProject = {
  user_id: userConnected?.id,
  name: faker.lorem.words(3),
  description: faker.lorem.sentence(),
  createdAt: new Date(),
  modifiedAt: new Date(),
};

describe('Comments Endpoints (e2e)', () => {
  beforeAll(async () => {
    await axios.post(`http://auth-service:3000/users`, createUser);
    const loginRes = await axios.post(`http://auth-service:3000/auth/login`, {
      email: createUser.email,
      password: createUser.password,
    });
    token = loginRes.data.access_token;
    const userProfile = await request(app.getHttpServer())
      .get('/authChat/profile')
      .set('Authorization', `Bearer ${token}`);
    userConnected = userProfile.body;

    const projectResponse = await axios.post(`http://project-service:3002/projects/`, createProject, {
      headers: {
        Authorization: `Bearer ${token} `,
        'Content-Type': 'application/json',
      },
    });
    project = projectResponse.data;
     createPost= {
      user_id: userConnected?.id,
      project_id: project.id,
      titre: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
  });

  describe('POST /posts', () => {



    it('should create a post', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(createPost);

      mypost = res.body
      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('user_id');
      expect(res.body).toHaveProperty('titre');
      expect(res.body).toHaveProperty('description');
    });

    it('should not create post without authentication', async () => {
      const res = await request(app.getHttpServer()).post('/posts').send(createPost);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });
  });

  describe('PATCH /posts/', () => {  
    it('should update a post', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/posts/${mypost.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ titre: 'newTitre'});
      expect(res.statusCode).toBe(200);
    });

    it('should not update post without authentication', async () => {
      const res = await request(app.getHttpServer()).patch(`/posts/${mypost.id}`).send({ titre: 'newTitre'});
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not update post with invalid token', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/posts/${mypost.id}`)
        .set('Authorization', 'Bearer invalid-token');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const res = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /posts/', () => {
    it('should return a single post', async () => {
      const res = await request(app.getHttpServer())
        .get(`/posts/${mypost.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', mypost.id);
    });

    it('should return 404 when ID does not exist', async () => {
      const res = await request(app.getHttpServer())
        .get('/posts/664')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Aucun post trouvé pour cet ID');
    });

    it('should not return post without authentication', async () => {
      const res = await request(app.getHttpServer()).get(`/posts/${mypost.id}`);
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not return post with invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get(`/posts/${mypost.id}`)
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });
  });
});
