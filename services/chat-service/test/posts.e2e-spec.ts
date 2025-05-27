import { INestApplication, HttpStatus, Body } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports , api_auth_URL , api_project_URL , api_user_URL} from './constants';
import { faker } from '@faker-js/faker';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { Post } from '../src/posts/entities/post.entity';
import axios from 'axios';

const AUTH_URL = api_auth_URL;
const PROJECT_URL = api_project_URL;
const USER_URL = api_user_URL;
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
 birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString(),
};

const createProject = {
  user_id: userConnected?.id,
  name: faker.lorem.words(3),
  description: faker.lorem.sentence(),
};

describe('Comments Endpoints (e2e)', () => {
  beforeAll(async () => {
     await axios.post(`${USER_URL}/`, createUser);
    const loginRes = await axios.post(`${AUTH_URL}/login`, {
      email: createUser.email,
      password: createUser.password,
    });
    token = loginRes.data.access_token;
    const userProfile = await request(app.getHttpServer())
      .get('/authChat/profile')
      .set('Authorization', `Bearer ${token}`);
    userConnected = userProfile.body;

    const projectResponse = await axios.post(`${PROJECT_URL}/`, createProject, {
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
      score : 0
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
