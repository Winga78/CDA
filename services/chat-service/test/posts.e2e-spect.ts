import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports} from './constants';
import { faker } from '@faker-js/faker';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';

let dataSource: DataSource;
let app: INestApplication;

beforeAll(async () => {
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
});

afterAll(async () => {
  await dataSource.destroy();
});


describe('Comments Endpoints (e2e)', () => {
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

   const createPost : CreatePostDto = {
    user_id: userConnected?.id,
    project_id: faker.number.int({ min: 1, max: 100 }),
    titre: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  beforeAll(async()=>{

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports,
    }).compile();
  
    app = moduleFixture.createNestApplication();
    await app.init();

    const createUserResponse = await request(app.getHttpServer()).post('/users/').send(createUser);
    const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
      email: createUserResponse.body.email,
      password: createUserResponse.body.password,
    });
    token = loginRes.body.access_token;

    const userProfile = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer ${token}`);
    userConnected = userProfile.body;
  })

  afterAll(async () => {
    await app.close();
  });

  describe('POST /posts', () => {
    it('should create a posts', async () => {
      const res = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(createPost);

      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('user_id', userConnected.id);
      expect(res.body).toHaveProperty('project_id');
      expect(res.body).toHaveProperty('titre', createPost.titre);
      expect(res.body).toHaveProperty('description', createPost.description);
    });

    it('should not create post without authentication', async () => {
      const res = await request(app.getHttpServer()).post('/posts').send(createPost);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

  });

  describe('PATCH /posts/', () => {
         let post;
         let users_has_voted;

      beforeAll(async () => {
        post = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(createPost);
        
        for (let i = 0; i < 5; i++) {
          users_has_voted.push(createUser)
        }
      })

    it('should update a post', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/posts/`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...post, participants: users_has_voted})
      expect(res.statusCode).toBe(200);
    });

    it('should not update post without authentication', async () => {
      const res = await request(app.getHttpServer()).patch('/posts').send(createPost);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

    it('should not update post with invalid token', async () => {
      const res = await request(app.getHttpServer()).patch('/posts').set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token invalide');
    });

    it('should not update post with malformed token', async () => {
      const res = await request(app.getHttpServer()).patch('/posts').set('Authorization', 'InvalidTokenFormat');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

  });

  // describe('GET /posts', () => {
  //   it('should return all posts', async () => {
  //     const res = await request(app.getHttpServer()).get('/posts').set('Authorization', `Bearer ${token}`);
  //     expect(res.statusCode).toBe(200);
  //     expect(Array.isArray(res.body)).toBe(true);
  //   });
  // });

  // // Récupérer un postaire par son ID
  // describe('GET /posts/', () => {
  //   let post;

  //   beforeAll(async () => {
  //      post = await request(app.getHttpServer())
  //     .post('/posts')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(createPost);
  //   })

  //   it('should return a single post', async () => {
  //     const res = await request(app.getHttpServer()).get(`/posts/`).set('Authorization', `Bearer ${token}`)
  //     .send(post.id);
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body).toHaveProperty('id', post.id);
  //   });

  //   it('should return 404 when ID does not exist', async () => {
  //     const res = await request(app.getHttpServer()).get(`/posts/`).set('Authorization', `Bearer ${token}`).send('46556');
  //     expect(res.statusCode).toBe(404);
  //     expect(res.body).toHaveProperty('message', 'Aucun postaire trouvé pour cette id');
  //   });


  //   it('should not return post without authentication', async () => {
  //     const res = await request(app.getHttpServer()).get(`/posts/`).send(post.id);
  //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  //   it('should not return post with invalid token', async () => {
  //     const res = await request(app.getHttpServer()).get('/posts').set('Authorization', 'Bearer invalid-token').send(post.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token invalide');
  //   });

  //   it('should not return post with malformed token', async () => {
  //     const res = await request(app.getHttpServer()).get('/posts').set('Authorization', 'InvalidTokenFormat').send(post.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  // });

  // // Récuper les postaires par l'id du Post
  // describe('GET /posts/post/', () => {
  //   let post;
  
  //   beforeAll(async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/posts')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(createPost);
  
  //     post = res.body;
  //   });
  
  //   it('should return a post by post ID', async () => {
  //     const res = await request(app.getHttpServer()).get(`/posts/post/`).set('Authorization', `Bearer ${token}`).send(post.post_id.id);
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body).toHaveProperty('id', post.id);
  //   });
  
  //   it('should return 404 when post ID does not exist', async () => {
  //     const res = await request(app.getHttpServer()).get(`/posts/post/999999`);
  //     expect(res.statusCode).toBe(404);
  //     expect(res.body).toHaveProperty('message', 'Aucun postaire trouvé pour ce post');
  //   });


  //   it('should not return post without authentication', async () => {
  //     const res = await request(app.getHttpServer()).get(`/posts/post/`).send(post.post_id.id);
  //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  //   it('should not return post with invalid token', async () => {
  //     const res = await request(app.getHttpServer()).get('/posts/post/').set('Authorization', 'Bearer invalid-token').send(post.post_id.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token invalide');
  //   });

  //   it('should not return post with malformed token', async () => {
  //     const res = await request(app.getHttpServer()).get('/posts').set('Authorization', 'InvalidTokenFormat').send(post.post_id.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  // });

  // // Supprimer un postaire par son Id
  // describe('DELETE /posts/', () => {

  //   let post;
  
  //   beforeAll(async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/posts')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(createPost);
  
  //     post = res.body;
  //   });
  

  //   it('should delete a post', async () => {
  //     const res = await request(app.getHttpServer())
  //       .delete(`/posts/`)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(post.id);
  //     expect(res.statusCode).toBe(200);
  //   });

  //   it('should delete 404 when post ID does not exist', async () => {
  //     const res = await request(app.getHttpServer()).delete(`/posts/`).send('66556');
  //     expect(res.statusCode).toBe(404);
  //     expect(res.body).toHaveProperty('message', 'Aucun postaire trouvé pour ce post');
  //   });


  //   it('should not delete post without authentication', async () => {
  //     const res = await request(app.getHttpServer()).delete(`/posts/`).send(post.id);
  //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  //   it('should not delete post with invalid token', async () => {
  //     const res = await request(app.getHttpServer()).delete('/posts/').set('Authorization', 'Bearer invalid-token').send(post.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token invalide');
  //   });

  //   it('should not delete post with malformed token', async () => {
  //     const res = await request(app.getHttpServer()).delete('/posts/').set('Authorization', 'InvalidTokenFormat').send(post.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });


  // });
});
