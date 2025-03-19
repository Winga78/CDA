import { INestApplication , HttpStatus} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { database, imports , jwt_secret } from "./constants";
import { CreateUserDto } from "../src/users/dto/create-user.dto";
import { faker} from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';

beforeAll(async () => {
  await mongoose.connect(database);
  await mongoose.connection.asPromise();
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  } else {
    throw new Error("La connexion à MongoDB n'est pas encore établie.");
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth Endpoints (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports,
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    jwtService = moduleFixture.get<JwtService>(JwtService);
 });


 const createUser : CreateUserDto = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  birthday: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
  role: 'user',
  createdAt: faker.date.soon({ refDate: '2023-01-01T00:00:00.000Z' }),
 }

   describe('POST /auth/', () => {
      it('/users/ (POST) 201', () => {
         return request(app.getHttpServer())
            .post('/users/')
            .set('Accept', 'application/json')
            .send(createUser)
            .expect(({ body }) => {
                expect(body.firstname).toEqual(createUser.firstname);
                expect(body.lastname).toEqual(createUser.lastname);
                expect(body.email).toEqual(createUser.email);
                expect(new Date(body.birthday)).toEqual(createUser.birthday);
                expect(body.role).toEqual(createUser.role);
            })
            .expect(HttpStatus.CREATED);
       });


      it('should not create duplicate user', async () => {
        const res = await request(app.getHttpServer()).post('/users/').send(createUser);
        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('message','Un utilisateur avec cet email exite déjà');
      });

      it('should not create user with invalid email', async () => {
        const res = await request(app.getHttpServer()).post('/users/').send({
          ...createUser,
          email: 'invalid-email',
        });
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('message','Email invalide');
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
      

      const decoded = await jwtService.verifyAsync(
              res.body.access_token,
              {
                secret: jwt_secret
              }
            );
      expect(decoded).toHaveProperty('email', createUser.email);
      expect(decoded).toHaveProperty('role', createUser.role);
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
    let token;
    beforeAll(async () => {
      await request(app.getHttpServer()).post('/users/').send(createUser);
      const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
        email: createUser.email,
        password: createUser.password,
      });
      token = loginRes.body.access_token;
    });

    it('should get user profile with valid token', async () => {
      const res = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', createUser.email);
      expect(res.body).toHaveProperty('role', createUser.role);
    });

    it('should not get profile without token', async () => {
      const res = await request(app.getHttpServer()).get('/auth/profile');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not get profile with invalid token', async () => {
      const res = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });
  });

});
