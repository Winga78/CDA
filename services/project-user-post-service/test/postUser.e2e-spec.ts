import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports } from './constants';
import { faker } from '@faker-js/faker';
import { PostUser } from '../src/post-user/entities/post-user.entity';
import { CreatePostUserDto } from 'src/post-user/dto/create-post-user.dto';
import axios from 'axios';

let dataSource: DataSource;
let app: INestApplication;
let token: any;
let userConnected: any;
let post: any;
let project:any;
let createPost:any;

beforeAll(async () => {
    // Database setup
    dataSource = new DataSource({
      type: 'mysql',
      host: database.host,
      port: parseInt(database.port),
      username: database.username,
      password: database.password,
      database: database.database,
      entities: [PostUser],
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
const createProject = {
    user_id: userConnected?.id,
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

 

describe('Vote Endpoints (e2e)', () => {
    beforeAll(async () => {
        const createUserResponse = await axios.post(`http://auth-service:3000/users`, createUser);
        const loginRes = await axios.post(`http://auth-service:3000/auth/login`, { email: createUserResponse.data.email, password: createUser.password });
    
        token = loginRes.data.access_token;
    
        const userProfile = await request(app.getHttpServer()).get('/relation/profile').set('Authorization', `Bearer ${token}`);
        userConnected = userProfile.body;

        const projectResponse = await axios.post(`http://project-service:3002/projects/`, createProject, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
          },
        });

        project = projectResponse.data;

        createPost = {
            user_id: userConnected?.id,
            project_id: project.id,
            titre: faker.lorem.words(3),
            description: faker.lorem.sentence(),
            createdAt: new Date(),
            modifiedAt: new Date(),
        };

        const postResponse = await axios.post(`http://chat-service:3001/posts/`, createPost, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });
      post = postResponse.data;
    });
  
    describe('POST /post-user', () => {
        it('should create a chatroom', async () => {
            const res = await request(app.getHttpServer())
              .post('/post-user')
              .set('Authorization', `Bearer ${token}`)
              .send({post_id : post.id , participant_id : userConnected.id});
            expect(res.statusCode).toBe(HttpStatus.CREATED);
            expect(res.body.post_id).toEqual(post.id);
            expect(res.body.participant_id).toEqual(userConnected.id);
          });
          it('should not create chatRoom without authentication', async () => {
            const res = await request(app.getHttpServer()).post('/post-user').send({post_id : post.id , participant_email : userConnected.email});
            expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Token manquant');
          });         
    });

    describe('GET /post-user/', () => {        
        it('should return vote', async () => {
          const res = await request(app.getHttpServer())
            .get(`/post-user/`)
            .set('Authorization', `Bearer ${token}`)
            .send({id :post.id});
          expect(res.statusCode).toBe(200);
          expect(Array.isArray(res.body)).toBe(true);
        });

        it('should not return project without authentication', async () => {
          const res = await request(app.getHttpServer())
          .get(`/post-user/`)
          .send({id :post.id});
          expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(res.body).toHaveProperty('message', 'Token manquant');
        });

        it('should not return project with invalid token', async () => {
          const res = await request(app.getHttpServer()).get(`/post-user/`)
          .send({id :post.id})
          .set('Authorization', 'Bearer invalid-token');
          expect(res.statusCode).toBe(401);
          expect(res.body).toHaveProperty('message', 'Token invalide');
        });
    });

    describe('DELETE /post-user/', () => {
      
      it('should delete a project', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/post-user/`)
          .send({id :post.id})
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Vote supprimé avec succès');
      });
    
      it('should not delete project without authentication', async () => {
        const res = await request(app.getHttpServer()).delete(`/post-user/`)
        .send({id :post.id});
        expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(res.body).toHaveProperty('message', 'Token manquant');
      });
  
      it('should not delete project with invalid token', async () => {
        const res = await request(app.getHttpServer()).delete(`/post-user/`)
        .send({id :post.id})
        .set('Authorization', 'Bearer invalid-token');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Token invalide');
      });
    });

});
