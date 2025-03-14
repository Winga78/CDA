import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports} from './constants';
import { faker } from '@faker-js/faker';
import { CreateCollectionDto } from 'src/collections/dto/create-collection.dto';

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

describe('Collections Endpoints (e2e)', () => {
   const createCollection : CreateCollectionDto = {
    user_id: userConnected?.id,
    name: faker.lorem.words(3),
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  describe('POST /collections', () => {
    it('should create a collections', async () => {
      const res = await request(app.getHttpServer())
        .post('/collections')
        .set('Authorization', `Bearer ${token}`)
        .send(createCollection);

      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('user_id', userConnected.id);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', createCollection.name);
    });

    it('should not create collection without authentication', async () => {
      const res = await request(app.getHttpServer()).post('/collections').send(createCollection);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

  });

    describe('PATCH /collections/', () => {
         let collection;

      beforeAll(async () => {
        collection = await request(app.getHttpServer())
        .post('/collections')
        .set('Authorization', `Bearer ${token}`)
        .send(createCollection);
      })

    it('should update a collection', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/collections/`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...collection, description: 'Updated description'});
      expect(res.statusCode).toBe(200);
    });

    it('should not update collection without authentication', async () => {
      const res = await request(app.getHttpServer()).patch('/collections').send(createCollection);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not update collection with invalid token', async () => {
      const res = await request(app.getHttpServer()).patch('/collections').set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });

    it('should not update collection with malformed token', async () => {
      const res = await request(app.getHttpServer()).patch('/collections').set('Authorization', 'InvalidTokenFormat');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

  });

  describe('GET /collections', () => {
    it('should return all Collections', async () => {
      const res = await request(app.getHttpServer()).get('/collections').set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // Récupérer un collection par son ID
  describe('GET /collections/', () => {
    let collection;

    beforeAll(async () => {
       collection = await request(app.getHttpServer())
      .post('/collections')
      .set('Authorization', `Bearer ${token}`)
      .send(createCollection);
    })

    it('should return a single collection', async () => {
      const res = await request(app.getHttpServer()).get(`/collections/`).set('Authorization', `Bearer ${token}`)
      .send(collection.id);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', collection.id);
    });

    it('should return 404 when ID does not exist', async () => {
      const res = await request(app.getHttpServer()).get(`/collections/`).set('Authorization', `Bearer ${token}`).send('46556');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Aucun collection trouvé pour cette id');
    });


    it('should not return collection without authentication', async () => {
      const res = await request(app.getHttpServer()).get(`/collections/`).send(collection.id);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not return collection with invalid token', async () => {
      const res = await request(app.getHttpServer()).get('/collections').set('Authorization', 'Bearer invalid-token').send(collection.id);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });

    it('should not return collection with malformed token', async () => {
      const res = await request(app.getHttpServer()).get('/collections').set('Authorization', 'InvalidTokenFormat').send(collection.id);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

  });

  
  // Supprimer un collection par son Id
  describe('DELETE /collections/', () => {

    let collection;
  
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/collections')
        .set('Authorization', `Bearer ${token}`)
        .send(createCollection);
  
      collection = res.body;
    });
  

    it('should delete a collections', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/collections/`)
        .set('Authorization', `Bearer ${token}`)
        .send(collection.id);
      expect(res.statusCode).toBe(200);
    });

    it('should delete 404 when collection ID does not exist', async () => {
      const res = await request(app.getHttpServer()).delete(`/collections/`).send('66556');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Aucun collection trouvé');
    });


    it('should not delete collection without authentication', async () => {
      const res = await request(app.getHttpServer()).delete(`/collections/`).send(collection.id);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not delete collection with invalid token', async () => {
      const res = await request(app.getHttpServer()).delete('/collections/').set('Authorization', 'Bearer invalid-token').send(collection.id);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });

    it('should not delete collection with malformed token', async () => {
      const res = await request(app.getHttpServer()).delete('/collections/').set('Authorization', 'InvalidTokenFormat').send(collection.id);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });


  });
});
