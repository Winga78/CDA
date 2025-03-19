import { INestApplication , HttpStatus} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import mongoose from 'mongoose';
import { database, imports , jwt_secret } from "./constants";
import { CreateUserDto } from "../src/users/dto/create-user.dto";
import { faker} from '@faker-js/faker';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

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

describe('User Endpoints (e2e)', () => {
  let app: INestApplication;
  let token;
  let user_connected;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports,
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();


    await request(app.getHttpServer()).post('/users/').send(createUser);
    await request(app.getHttpServer()).post('/users/').send(createUser2);
    
    const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
        email: createUser.email,
        password: createUser.password,
    });
    token = loginRes.body.access_token;
    const user_profile = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer ${token}`);
    user_connected = user_profile.body
 });

 
 afterAll(async () => {
  await app.close();
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

 const updateUser : UpdateUserDto = {
  firstname: createUser.firstname,
  lastname: 'new_lastname',
  password: createUser.password,
  email: 'new_email@gmail.com',
  birthday: createUser.birthday,
 }

 const createUser2 : CreateUserDto = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  password: faker.internet.password(),
  email: 'user02@yahoo.fr',
  birthday: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
  role: 'user',
  createdAt: faker.date.soon({ refDate: '2023-01-01T00:00:00.000Z' }),
 }


  //Rechercher des utilisateurs
  describe('GET /users/', () => {
    it('/users/ (GET) 200 ', async () => {
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
      .get(`/users/660000000000000000000000`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', "Utilisateur non trouvé");
  });

  it('should get a user by email', async () => {
    const res = await request(app.getHttpServer())
      .post(`/users/other/`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: user_connected.email });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', user_connected.id);
  });

  it('should return 404 if user by email is not found', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/other/')
      .set('Authorization', `Bearer ${token}`)
      .send({ email:'nonexistent@example.com'});

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', "Utilisateur non trouvé");
  });
   
  });

 //Mettre à jour un utilisateur
   describe('PATCH /users/', () => {
    it('/users/ (PATCH) 200', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${user_connected.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateUser)
        .expect(({ body }) => {
          expect(body.email).toEqual(updateUser.email);
          expect(body.lastname).toEqual(updateUser.lastname)
      })
    });

    it('should not update a non-existing user', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/660000000000000000000000`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateUser);
  
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', "Impossible de mettre à jour, utilisateur non trouvé");
    });


    it('should not update user with an existing email', async () => {
      
      const res = await request(app.getHttpServer())
        .patch(`/users/${user_connected.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: createUser2.email });
  
      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('message', 'Cet email est déjà utilisé');
    })

    it('should not update user with an invalid email', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${user_connected.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalid-email' });
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Email invalide');

    })

    it('should not update user without authentication', async () => {
      const res = await request(app.getHttpServer()).patch(`/users/${user_connected.id}`).send(updateUser);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not update user with invalid token', async () => {
      const res = await request(app.getHttpServer()).patch(`/users/${user_connected.id}`).set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });    
  });

    //Supprimer un utilisateur
    describe('DELETE /users/:id', () => {  
      it('/users/ (DELETE) 200', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/users/${user_connected.id}`)
          .set('Authorization', `Bearer ${token}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Utilisateur supprimé avec succès');

        const checkUser = await request(app.getHttpServer())
          .get(`/users/${user_connected.id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(checkUser.statusCode).toBe(404);
      });

    
      it('should not delete a non-existing user', async () => {
       const res = await request(app.getHttpServer())
      .delete(`/users/660000000000000000000000`)
      .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', "Impossible de supprimer, utilisateur non trouvé");
     });

     it('should not delete user without authentication', async () => {
      const res = await request(app.getHttpServer()).delete(`/users/${user_connected.id}`);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not delete user with invalid token', async () => {
      const res = await request(app.getHttpServer()).delete(`/users/${user_connected.id}`).set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });

    })

});
