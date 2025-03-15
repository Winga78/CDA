import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports} from './constants';
import { faker } from '@faker-js/faker';
import { CreateProjectDto } from 'src/projects/dto/create-project.dto';

let dataSource: DataSource;
let app: INestApplication;
let token:any;
let userConnected:any;

const createUser = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
  role: 'user',
  createdAt: faker.date.soon({ refDate: '2023-01-01T00:00:00.000Z' }),
};


beforeAll(async () => {
  // Database setup
  dataSource = new DataSource({
    type: 'mysql',
    host: database.host,
    port: parseInt(database.port),
    username: database.username,
    password: database.password,
    database: database.database,
    entities: [Comment],
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
  await dataSource.destroy();
  await app.close();
});

beforeEach(async () => {
  const createUserResponse = await request(app.getHttpServer()).post('/users/').send(createUser);
  const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
    email: createUserResponse.body.email,
    password: createUserResponse.body.password,
  });
  token = loginRes.body.access_token;

  const userProfile = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer ${token}`);
  userConnected = userProfile.body;

});

describe('Comments Endpoints (e2e)', () => {
   const createProject : CreateProjectDto = {
    user_id: userConnected?.id,
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  describe('POST /projects', () => {
    it('should create a projects', async () => {
      const res = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(createProject);

      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('user_id', userConnected.id);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', createProject.name);
      expect(res.body).toHaveProperty('description', createProject.description);
    });

    it('should not create project* without authentication', async () => {
      const res = await request(app.getHttpServer()).post('/projects').send(createProject);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

  });

    describe('PATCH /projects/', () => {
         let project;
         let users_participants;

      beforeAll(async () => {
        project = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(createProject);

        for (let i = 0; i < 5; i++) {
          users_participants.push({email : faker.internet.email()})
        }
      })

    it('should update a project', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/projects/`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...project, description: 'Updated description'});
      expect(res.statusCode).toBe(200);
    });

    it('should not update project without authentication', async () => {
      const res = await request(app.getHttpServer()).patch('/projects').send(createProject);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not update project with invalid token', async () => {
      const res = await request(app.getHttpServer()).patch('/projects').set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });

    it('should not update project with malformed token', async () => {
      const res = await request(app.getHttpServer()).patch('/projects').set('Authorization', 'InvalidTokenFormat');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

  });

  describe('GET /projects', () => {
    it('should return all projects', async () => {
      const res = await request(app.getHttpServer()).get('/projects').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // Récupérer un project par son ID
  describe('GET /projects/', () => {
    let project;

    beforeAll(async () => {
       project = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(createProject);
    })

    it('should return a single project', async () => {
      const res = await request(app.getHttpServer()).get(`/projects/`).set('Authorization', `Bearer ${token}`)
      .send(project.id);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', project.id);
    });

    it('should return 404 when ID does not exist', async () => {
      const res = await request(app.getHttpServer()).get(`/projects/`).set('Authorization', `Bearer ${token}`).send('46556');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Aucun project trouvé pour cette id');
    });


    it('should not return project without authentication', async () => {
      const res = await request(app.getHttpServer()).get(`/projects/`).send(project.id);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not return project with invalid token', async () => {
      const res = await request(app.getHttpServer()).get('/projects').set('Authorization', 'Bearer invalid-token').send(project.id);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });

    it('should not return project with malformed token', async () => {
      const res = await request(app.getHttpServer()).get('/projects').set('Authorization', 'InvalidTokenFormat').send(project.id);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

  });

  
  // Supprimer un project par son Id
  describe('DELETE /projects/', () => {

    let project;
  
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send(createProject);
  
      project = res.body;
    });
  

    it('should delete a projects', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/projects/`)
        .set('Authorization', `Bearer ${token}`)
        .send(project.id);
      expect(res.statusCode).toBe(200);
    });

    it('should delete 404 when project ID does not exist', async () => {
      const res = await request(app.getHttpServer()).delete(`/projects/`).send('66556');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Aucun project trouvé');
    });


    it('should not delete project without authentication', async () => {
      const res = await request(app.getHttpServer()).delete(`/projects/`).send(project.id);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not delete project with invalid token', async () => {
      const res = await request(app.getHttpServer()).delete('/projects/').set('Authorization', 'Bearer invalid-token').send(project.id);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });

    it('should not delete project with malformed token', async () => {
      const res = await request(app.getHttpServer()).delete('/projects/').set('Authorization', 'InvalidTokenFormat').send(project.id);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });


  });
});
