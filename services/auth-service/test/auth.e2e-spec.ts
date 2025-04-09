import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import mongoose from 'mongoose';
import { database, imports, jwt_secret } from './constants';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';

let app: INestApplication;
let jwtService: JwtService;

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
  jwtService = moduleFixture.get<JwtService>(JwtService);
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
  birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' })
};

describe('Auth Endpoints (e2e)', () => {
  describe('POST /users/', () => {
    it('should create a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/')
        .set('Accept', 'application/json')
        .send(createUser)
        .expect(HttpStatus.CREATED);

      expect(res.body.firstname).toEqual(createUser.firstname);
      expect(res.body.lastname).toEqual(createUser.lastname);
      expect(res.body.email).toEqual(createUser.email);
      expect(new Date(res.body.birthday)).toEqual(createUser.birthday);
    });

    it('should not create a duplicate user', async () => {
      await request(app.getHttpServer()).post('/users/').send(createUser);
      const res = await request(app.getHttpServer()).post('/users/').send(createUser);
      
      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('message', 'Un utilisateur avec cet email existe déjà');
    });

    it('should not create user with invalid email', async () => {
      const res = await request(app.getHttpServer()).post('/users/').send({
        ...createUser,
        email: 'invalid-email',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Email invalide');
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      await request(app.getHttpServer()).post('/users/').send(createUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        email: createUser.email,
        password: createUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('access_token');

      const decoded = await jwtService.verifyAsync(res.body.access_token, { secret: jwt_secret });
      expect(decoded).toHaveProperty('email', createUser.email);
    });

    it('should not login with wrong password', async () => {
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        email: createUser.email,
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Email ou mot de passe incorrect');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Utilisateur non trouvé');
    });
  });

  describe('GET /auth/profile', () => {
    let token: string;

    beforeAll(async () => {
      await request(app.getHttpServer()).post('/users/').send(createUser);
      const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
        email: createUser.email,
        password: createUser.password,
      });
      token = loginRes.body.access_token;
    });

    it('should get user profile with valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', createUser.email);
    });

    it('should not get profile without token', async () => {
      const res = await request(app.getHttpServer()).get('/auth/profile');
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not get profile with invalid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });
  });
});