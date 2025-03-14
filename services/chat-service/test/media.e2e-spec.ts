import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});














// import { INestApplication, HttpStatus } from '@nestjs/common';
// import { Test, TestingModule } from '@nestjs/testing';
// import * as request from 'supertest';
// import { DataSource } from 'typeorm';
// import { database, imports} from './constants';
// import { faker } from '@faker-js/faker';
// import { test, expect } from '@playwright/test';
// import { CreateMediaDto } from 'src/medias/dto/create-media.dto';

// let dataSource: DataSource;
// let app: INestApplication;

// beforeAll(async () => {
//   dataSource = new DataSource({
//     type: 'mysql',
//     host: database.host,
//     port: parseInt(database.port,10),
//     username: database.username,
//     password: database.password,
//     database: database.database,
//     entities: [Comment],
//     synchronize: true,
//     dropSchema: true,
//   });
//   await dataSource.initialize();
// });

// afterAll(async () => {
//   await dataSource.destroy();
// });


// describe('Medias Endpoints (e2e)', () => {
//   let token:any;
//   let userConnected:any;
//   let comment:any;
//   let post:any;
//   let media;

//   const createUser = {
//     firstname: faker.person.firstName(),
//     lastname: faker.person.lastName(),
//     password: faker.internet.password(),
//     email: faker.internet.email(),
//     birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
//     role: 'user',
//     createdAt: faker.date.soon({ refDate: '2023-01-01T00:00:00.000Z' }),
//   };
  
//   const createComment = {
//       commentator: userConnected?.id,
//       po_id: { id: faker.number.int({ min: 1, max: 100 }) },
//       participants: [],
//       name: faker.lorem.words(3),
//       description: faker.lorem.sentence(),
//       createdAt: new Date(),
//       modifiedAt: new Date(),
//   };
  
 
//    const createPost : CreateMediaDto = {
//     comment_id: comment ,
//     po_id: post,
//     name: faker.lorem.words(3),
//     type: 'png',
//     path: 'services/chat-service/src/medias/uploads/sphere.png',
//     size : '12',
//     createdAt: new Date(),
//     modifiedAt: new Date(),
//   };

//   beforeAll(async()=>{
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports,
//      }).compile();
 
//      app = moduleFixture.createNestApplication();
//      await app.init();
 
//      const createUserResponse = await request(app.getHttpServer()).post('/users/').send(createUser);
//      const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
//        email: createUserResponse.body.email,
//        password: createUserResponse.body.password,
//      });
//      token = loginRes.body.access_token;
 
//      const userProfile = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer ${token}`);
//      userConnected = userProfile.body;
 
//      comment = await request(app.getHttpServer()).post('/comments').set('Authorization', `Bearer ${token}`).send(createComment);
//      post = await request(app.getHttpServer()).post('/posts').set('Authorization', `Bearer ${token}`).send(createPost);
 
//      test('Upload d\'un fichier PNG', async ({ page }) => {
//         await page.goto('http://localhost:3001/medias'); // Remplace par ton URL
   
//      // Sélection du champ d'upload et simulation d'un fichier PNG
//      const fileInput = await page.locator('input[type="file"]');
//      await fileInput.setInputFiles('services/chat-service/src/medias/uploads/sphere.png');
   
//      // Vérifie que le fichier a bien été uploadé (ex: présence d'un preview)
//       media = page.locator('.uploaded-file');
//       await expect(media).toBeVisible();
 
//    })
//  })

//  afterAll(async () => {
//   await app.close();
//  });

//   describe('POST /medias', () => {
//     it('/medias/ (POST) 200', async () => {
//       const res = await request(app.getHttpServer())
//         .post('/medias')
//         .set('Authorization', `Bearer ${token}`)
//         .send(createPost);

//       expect(res.statusCode).toBe(HttpStatus.CREATED);
//       expect(res.body).toHaveProperty('po_id');
//       expect(res.body).toHaveProperty('name', createPost.name);
//       expect(res.body).toHaveProperty('description', createPost.size);
//     });

//     it('should not create media without authentication', async () => {
//       const res = await request(app.getHttpServer()).post('/medias').send(createPost);
//       expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
//       expect(res.body).toHaveProperty('message', 'Token manquant');
//     });

//   });

//   //   describe('PATCH /medias/', () => {
//   //        let media;

//   //     beforeAll(async () => {
//   //       media = await request(app.getHttpServer())
//   //       .post('/medias')
//   //       .set('Authorization', `Bearer ${token}`)
//   //       .send(createPost);
//   //     })

//   //   it('should update a media', async () => {
//   //     const res = await request(app.getHttpServer())
//   //       .patch(`/medias/`)
//   //       .set('Authorization', `Bearer ${token}`)
//   //       .send({ ...media, description: 'Updated description'});
//   //     expect(res.statusCode).toBe(200);
//   //   });

//   //   it('should not update media without authentication', async () => {
//   //     const res = await request(app.getHttpServer()).patch('/medias').send(createPost);
//   //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
//   //     expect(res.body).toHaveProperty('message', 'Token manquant');
//   //   });

//   //   it('should not update media with invalid token', async () => {
//   //     const res = await request(app.getHttpServer()).patch('/medias').set('Authorization', 'Bearer invalid-token');

//   //     expect(res.statusCode).toBe(401);
//   //     expect(res.body).toHaveProperty('message', 'Token invalide');
//   //   });

//   //   it('should not update media with malformed token', async () => {
//   //     const res = await request(app.getHttpServer()).patch('/medias').set('Authorization', 'InvalidTokenFormat');

//   //     expect(res.statusCode).toBe(401);
//   //     expect(res.body).toHaveProperty('message', 'Token manquant');
//   //   });

//   // });

//   // describe('GET /medias', () => {
//   //   it('should return all medias', async () => {
//   //     const res = await request(app.getHttpServer()).get('/medias').set('Authorization', `Bearer ${token}`);
//   //     expect(res.statusCode).toBe(200);
//   //     expect(Array.isArray(res.body)).toBe(true);
//   //   });
//   // });

//   // // Récupérer un media par son ID
//   // describe('GET /medias/', () => {
//   //   let media;

//   //   beforeAll(async () => {
//   //      media = await request(app.getHttpServer())
//   //     .post('/medias')
//   //     .set('Authorization', `Bearer ${token}`)
//   //     .send(createPost);
//   //   })

//   //   it('should return a single media', async () => {
//   //     const res = await request(app.getHttpServer()).get(`/medias/`).set('Authorization', `Bearer ${token}`)
//   //     .send(media.id);
//   //     expect(res.statusCode).toBe(200);
//   //     expect(res.body).toHaveProperty('id', media.id);
//   //   });

//   //   it('should return 404 when ID does not exist', async () => {
//   //     const res = await request(app.getHttpServer()).get(`/medias/`).set('Authorization', `Bearer ${token}`).send('46556');
//   //     expect(res.statusCode).toBe(404);
//   //     expect(res.body).toHaveProperty('message', 'Aucun media trouvé pour cette id');
//   //   });


//   //   it('should not return media without authentication', async () => {
//   //     const res = await request(app.getHttpServer()).get(`/medias/`).send(media.id);
//   //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
//   //     expect(res.body).toHaveProperty('message', 'Token manquant');
//   //   });

//   //   it('should not return media with invalid token', async () => {
//   //     const res = await request(app.getHttpServer()).get('/medias/').set('Authorization', 'Bearer invalid-token').send(media.id);

//   //     expect(res.statusCode).toBe(401);
//   //     expect(res.body).toHaveProperty('message', 'Token invalide');
//   //   });

//   //   it('should not return media with malformed token', async () => {
//   //     const res = await request(app.getHttpServer()).get('/medias/').set('Authorization', 'InvalidTokenFormat').send(media.id);

//   //     expect(res.statusCode).toBe(401);
//   //     expect(res.body).toHaveProperty('message', 'Token manquant');
//   //   });

//   // });

 

//   // // Supprimer un media par son Id
//   // describe('DELETE /medias/', () => {

//   //   let media;
  
//   //   beforeAll(async () => {
//   //     const res = await request(app.getHttpServer())
//   //       .post('/medias')
//   //       .set('Authorization', `Bearer ${token}`)
//   //       .send(createPost);
  
//   //     media = res.body;
//   //   });
  

//   //   it('should delete a media', async () => {
//   //     const res = await request(app.getHttpServer())
//   //       .delete(`/medias/`)
//   //       .set('Authorization', `Bearer ${token}`)
//   //       .send(media.id);
//   //     expect(res.statusCode).toBe(200);
//   //   });

//   //   it('should delete 404 when media ID does not exist', async () => {
//   //     const res = await request(app.getHttpServer()).delete(`/medias/`).send('66556');
//   //     expect(res.statusCode).toBe(404);
//   //     expect(res.body).toHaveProperty('message', 'Aucun media trouvé pour ce media');
//   //   });


//   //   it('should not delete media without authentication', async () => {
//   //     const res = await request(app.getHttpServer()).delete(`/medias/`).send(media.id);
//   //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
//   //     expect(res.body).toHaveProperty('message', 'Token manquant');
//   //   });

//   //   it('should not delete media with invalid token', async () => {
//   //     const res = await request(app.getHttpServer()).delete('/medias/').set('Authorization', 'Bearer invalid-token').send(media.id);

//   //     expect(res.statusCode).toBe(401);
//   //     expect(res.body).toHaveProperty('message', 'Token invalide');
//   //   });

//   //   it('should not delete media with malformed token', async () => {
//   //     const res = await request(app.getHttpServer()).delete('/medias/').set('Authorization', 'InvalidTokenFormat').send(media.id);

//   //     expect(res.statusCode).toBe(401);
//   //     expect(res.body).toHaveProperty('message', 'Token manquant');
//   //   });


//   // });
// });
