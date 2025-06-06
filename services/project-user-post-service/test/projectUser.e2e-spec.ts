import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports, api_auth_URL, api_project_URL,api_user_URL } from './constants';
import { faker } from '@faker-js/faker';
import { ProjectUser } from '../src/project-user/entities/project-user.entity';
import axios from 'axios';

let dataSource: DataSource;
let app: INestApplication;
let token: any;
let userConnected: any;
let project: any;

beforeAll(async () => {
    // Database setup
    dataSource = new DataSource({
      type: 'mysql',
      host: database.host,
      port: parseInt(database.port),
      username: database.username,
      password: database.password,
      database: database.database,
      entities: [ProjectUser],
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

describe('ChatRoom Endpoints (e2e)', () => {
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
      project = projectResponse.data
    });
  
    describe('POST /project-user', () => {
        it('should create a chatroom', async () => {
            const res = await request(app.getHttpServer())
              .post('/project-user')
              .set('Authorization', `Bearer ${token}`)
              .send({project_id : project.id , participant_id : userConnected.id});
            expect(res.statusCode).toBe(HttpStatus.CREATED);
            expect(res.body.project_id).toEqual(project.id);
            expect(res.body.participant_id).toEqual(userConnected.id);
          });
          it('should not create chatRoom without authentication', async () => {
            const res = await request(app.getHttpServer())
            .post('/project-user')
            .send({project_id : project.id , participant_id : userConnected.id});
            expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('message', 'Token manquant');
          });         
    });

    describe('GET /project-user/projects', () => {        
        it('should return projects for one participant', async () => {
          const res = await request(app.getHttpServer())
            .get('/project-user/projects/')
            .set('Authorization', `Bearer ${token}`);
          expect(res.statusCode).toBe(200);
          expect(Array.isArray(res.body)).toBe(true);
        });

        it('should not return project without authentication', async () => {
          const res = await request(app.getHttpServer()).get(`/project-user/projects/`);
          expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          expect(res.body).toHaveProperty('message', 'Token manquant');
        });

        it('should not return project with invalid token', async () => {
          const res = await request(app.getHttpServer()).get(`/project-user/projects/`).set('Authorization', 'Bearer invalid-token');
          expect(res.statusCode).toBe(401);
          expect(res.body).toHaveProperty('message', 'Token invalide');
        });
    });


    describe('GET /project-user/users/:id', () => {
      it('should return participants for one project', async () => {
        const res = await request(app.getHttpServer())
          .get(`/project-user/users/${project.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toBeDefined();
      });
    
      it('should not return project without authentication', async () => {
        const res = await request(app.getHttpServer())
        .get(`/project-user/users/${project.id}`);
        expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(res.body).toHaveProperty('message', 'Token manquant');
        expect(res.body).toBeDefined();
      });
    
      it('should not return project with invalid token', async () => {
        const res = await request(app.getHttpServer())
          .get(`/project-user/users/${project.id}`)
          .set('Authorization', 'Bearer invalid-token');
    
        expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(res.body).toHaveProperty('message', 'Token invalide');
        expect(res.body).toBeDefined();
      });
    });
    

    describe('DELETE /project-user/:id', () => {
      
      it('should delete a project', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/project-user/${project.id}/${userConnected.id}`)
          .send({email : userConnected.email})
          .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Utilisateur supprimé du projet avec succès');
      });
  
      it('should return 404 when project ID does not exist', async () => {
        const res = await request(app.getHttpServer())
        .delete(`/project-user/${project.id}/${userConnected.id}`)
        .send(userConnected.email)
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Impossible de supprimer, participant non trouvé');
      });
  
      it('should not delete project without authentication', async () => {
        const res = await request(app.getHttpServer())
        .delete(`/project-user/${project.id}/${userConnected.id}`)
        .send(userConnected.email);
        expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(res.body).toHaveProperty('message', 'Token manquant');
      });
  
      it('should not delete project with invalid token', async () => {
        const res = await request(app.getHttpServer())
        .delete(`/project-user/${project.id}/${userConnected.id}`)
        .send(userConnected.email)
        .set('Authorization', 'Bearer invalid-token');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Token invalide');
      });
    });

});
