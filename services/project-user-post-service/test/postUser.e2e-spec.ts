import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports , api_project_URL, api_chat_URL, api_auth_URL,api_user_URL } from './constantsPost';
import { faker } from '@faker-js/faker';
import { PostUser } from '../src/post-user/entities/post-user.entity';
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
};
const createProject = {
    user_id: userConnected?.id,
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
  };

 

describe('Vote Endpoints (e2e)', () => {
    beforeAll(async () => {
        const createUserResponse = await axios.post(`${api_user_URL}/`, createUser);
        const loginRes = await axios.post(`${api_auth_URL}/login`, { email: createUserResponse.data.email, password: createUser.password });
    
        token = loginRes.data.access_token;
    
        const userProfile = await request(app.getHttpServer()).get('/relation/profile').set('Authorization', `Bearer ${token}`);
        userConnected = userProfile.body;

        const projectResponse = await axios.post(`${api_project_URL}/`, createProject, {
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
            score : 0
        };

        const postResponse = await axios.post(`${api_chat_URL}/`, createPost, {
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
            const res = await request(app.getHttpServer()).post('/post-user').send({post_id : post.id , participant_id : userConnected.id});
            expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Token manquant');
          });         
    });

    describe('GET /post-user/', () => {        
        it('should return vote', async () => {
          const res = await request(app.getHttpServer())
            .get(`/post-user/votes/${post.id}`)
            .set('Authorization', `Bearer ${token}`)
          expect(res.statusCode).toBe(200);
          expect(typeof res.body.count).toBe('number');

        });

        it('should not return vote without authentication', async () => {
          const res = await request(app.getHttpServer())
          .get(`/post-user/votes/${post.id}`)
          expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(res.body).toHaveProperty('message', 'Token manquant');
        });

        it('should not return vote with invalid token', async () => {
          const res = await request(app.getHttpServer()).get(`/post-user/votes/${post.id}`)
          .set('Authorization', 'Bearer invalid-token');
          expect(res.statusCode).toBe(401);
          expect(res.body).toHaveProperty('message', 'Token invalide');
        });
    });

    describe('DELETE /post-user/', () => {
      
      it('should delete a vote', async () => {
        const res = await request(app.getHttpServer()).delete(`/post-user/vote/${post.id}/${post.user_id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Vote supprimé avec succès');
      });
    
      it('should not delete vote without authentication', async () => {
        const res = await request(app.getHttpServer()).delete(`/post-user/vote/${post.id}/${post.user_id}`)
        expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(res.body).toHaveProperty('message', 'Token manquant');
      });
  
      it('should not delete vote with invalid token', async () => {
        const res = await request(app.getHttpServer()).delete(`/post-user/vote/${post.id}/${post.user_id}`)
        .set('Authorization', 'Bearer invalid-token');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Token invalide');
      });
    });

});
