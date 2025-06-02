import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import mongoose from 'mongoose';
import { database, imports } from "./constants";
import { CreateUserDto } from "../src/users/dto/create-user.dto";
import { faker } from '@faker-js/faker';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

let app: INestApplication;

beforeAll(async () => {
  await mongoose.connect(database);
  await mongoose.connection.asPromise();
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  } else {
    throw new Error('La connexion à MongoDB n\'est pas encore établie.');
  }

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports,
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await app.close();
  await mongoose.disconnect();
});

const createUser: CreateUserDto = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
};

const createUser2: CreateUserDto = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  password: faker.internet.password(),
  email: 'user02@yahoo.fr',
  birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
};

const updateUser: UpdateUserDto = {
  firstname: createUser.firstname,
  lastname: 'new_lastname',
  password: createUser.password,
  email: 'new_email@gmail.com',
  birthday: createUser.birthday,
};

describe('User Endpoints (e2e)', () => {
  let token;
  let user_connected;

  beforeAll(async () => {
    await request(app.getHttpServer()).post('/users/').send(createUser);
    await request(app.getHttpServer()).post('/users/').send(createUser2);

    const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
      email: createUser.email,
      password: createUser.password,
    });
    token = loginRes.body.access_token;

    const userProfile = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer ${token}`);
    user_connected = userProfile.body;
  });

  describe('GET /users/', () => {
    it('/users/ (GET) 200', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a user by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/${user_connected.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', user_connected.id);
    });

    it('should return 404 if user by id is not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/660000000000000000000000')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', "Utilisateur non trouvé");
    });

    it('should get a user by email', async () => {
      const res = await request(app.getHttpServer())
        .get(`/users/other?email=${user_connected.email}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', user_connected.id);
    });

    it('should return 404 if user by email is not found', async () => {
      const res = await request(app.getHttpServer())
        .get('/users/other?email=nonexistent@example.com')
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', "Utilisateur non trouvé");
    });
  });

  describe('PATCH /users/', () => {
    it('/users/ (PATCH) 200', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateUser)
        .expect(({ body }) => {
          expect(body.email).toEqual(updateUser.email);
          expect(body.lastname).toEqual(updateUser.lastname);
        });
    });

    it('should not update user with an invalid email', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalid-email' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Email invalide');
    });

  });

  describe('DELETE /users/:id', () => {
    it('/users/ (DELETE) 200', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/users/`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Utilisateur supprimé avec succès');
    });
  });
});
