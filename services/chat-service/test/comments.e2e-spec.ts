import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { database, imports} from './constants';
import { faker } from '@faker-js/faker';
import { CreateCommentDto } from '../src/comments/dto/create-comment.dto';
import { Comment } from '../src/comments/entities/comment.entity';
import { CreatePostDto } from '../src/posts/dto/create-post.dto';

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

;
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('Comments Endpoints (e2e)', () => {

  let token:any;
  let userConnected:any;
  let projectCreated : any;

     const createPost : CreatePostDto = {
      user_id: userConnected.id ,
      project_id: projectCreated.id,
    name: faker.lorem.words(3),
    type: 'png',
    path: 'services/chat-service/src/medias/uploads/sphere.png',
    size : '12',
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  const createUser = {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    birthday: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    role: 'user',
    createdAt: faker.date.soon({ refDate: '2023-01-01T00:00:00.000Z' }),
  };

   const createComment : CreateCommentDto = {
    commentator: userConnected?.id,
    po_id: { id: faker.number.int({ min: 1, max: 100 }) },
    participants: [],
    name: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
   
  beforeAll(async()=>{

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports,
    }).compile();
  
    app = moduleFixture.createNestApplication();
    await app.init()

    const createUserResponse = await request(app.getHttpServer()).post('/users/').send(createUser);
    const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
     email: createUserResponse.body.email,
     password: createUserResponse.body.password,
    });
    token = loginRes.body.access_token;

    const userProfile = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer ${token}`);
    userConnected = userProfile.body;
   
    projectCreated = await request(app.getHttpServer()).post('/projects/').set('Authorization', `Bearer ${token}`).send({
       user_id: userConnected.id,
       collection: {},
    });;
  })

  afterAll(async () => {
    await app.close();
  });

  describe('POST /comments', () => {
    it('should create a comment', async () => {
      const res = await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${token}`)
        .send(createComment);

      expect(res.statusCode).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('commentator', userConnected.id);
      expect(res.body).toHaveProperty('po_id');
      expect(res.body).toHaveProperty('name', createComment.name);
      expect(res.body).toHaveProperty('description', createComment.description);
    });

    it('should not create comment without authentication', async () => {
      const res = await request(app.getHttpServer()).post('/comments').send(createComment);
      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body).toHaveProperty('message', 'Token manquant');
    });

  });

  // describe('PATCH /comments/', () => {
  //        let comment;

  //     beforeAll(async () => {
  //        comment = await request(app.getHttpServer())
  //       .post('/comments')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(createComment);
  //     })

  //   it('should update a comment', async () => {
  //     const res = await request(app.getHttpServer())
  //       .patch(`/comments/`)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({ ...comment, description: 'Updated description'});
  //     expect(res.statusCode).toBe(200);
  //   });

  //   it('should not update comment without authentication', async () => {
  //     const res = await request(app.getHttpServer()).patch('/comments').send(createComment);
  //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  //   it('should not update comment with invalid token', async () => {
  //     const res = await request(app.getHttpServer()).patch('/comments').set('Authorization', 'Bearer invalid-token');

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token invalide');
  //   });

  //   it('should not update comment with malformed token', async () => {
  //     const res = await request(app.getHttpServer()).patch('/comments').set('Authorization', 'InvalidTokenFormat');

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  // });

  // describe('GET /comments', () => {
  //   it('should return all comments', async () => {
  //     const res = await request(app.getHttpServer()).get('/comments').set('Authorization', `Bearer ${token}`);
  //     expect(res.statusCode).toBe(200);
  //     expect(Array.isArray(res.body)).toBe(true);
  //   });
  // });

  // // Récupérer un commentaire par son ID
  // describe('GET /comments/', () => {
  //   let comment;

  //   beforeAll(async () => {
  //      comment = await request(app.getHttpServer())
  //     .post('/comments')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(createComment);
  //   })

  //   it('should return a single comment', async () => {
  //     const res = await request(app.getHttpServer()).get(`/comments/`).set('Authorization', `Bearer ${token}`)
  //     .send(comment.id);
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body).toHaveProperty('id', comment.id);
  //   });

  //   it('should return 404 when ID does not exist', async () => {
  //     const res = await request(app.getHttpServer()).get(`/comments/`).set('Authorization', `Bearer ${token}`).send('46556');
  //     expect(res.statusCode).toBe(404);
  //     expect(res.body).toHaveProperty('message', 'Aucun commentaire trouvé pour cette id');
  //   });


  //   it('should not return comment without authentication', async () => {
  //     const res = await request(app.getHttpServer()).get(`/comments/`).send(comment.id);
  //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  //   it('should not return comment with invalid token', async () => {
  //     const res = await request(app.getHttpServer()).get('/comments').set('Authorization', 'Bearer invalid-token').send(comment.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token invalide');
  //   });

  //   it('should not return comment with malformed token', async () => {
  //     const res = await request(app.getHttpServer()).get('/comments').set('Authorization', 'InvalidTokenFormat').send(comment.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  // });

  // // Récuper les commentaires par l'id du Post
  // describe('GET /comments/post/', () => {
  //   let comment;
  
  //   beforeAll(async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/comments')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(createComment);
  
  //     comment = res.body;
  //   });
  
  //   it('should return a comment by post ID', async () => {
  //     const res = await request(app.getHttpServer()).get(`/comments/post/`).set('Authorization', `Bearer ${token}`).send(comment.post_id.id);
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body).toHaveProperty('id', comment.id);
  //   });
  
  //   it('should return 404 when post ID does not exist', async () => {
  //     const res = await request(app.getHttpServer()).get(`/comments/post/999999`);
  //     expect(res.statusCode).toBe(404);
  //     expect(res.body).toHaveProperty('message', 'Aucun commentaire trouvé pour ce post');
  //   });


  //   it('should not return comment without authentication', async () => {
  //     const res = await request(app.getHttpServer()).get(`/comments/post/`).send(comment.post_id.id);
  //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  //   it('should not return comment with invalid token', async () => {
  //     const res = await request(app.getHttpServer()).get('/comments/post/').set('Authorization', 'Bearer invalid-token').send(comment.post_id.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token invalide');
  //   });

  //   it('should not return comment with malformed token', async () => {
  //     const res = await request(app.getHttpServer()).get('/comments').set('Authorization', 'InvalidTokenFormat').send(comment.post_id.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  // });

  // // Supprimer un commentaire par son Id
  // describe('DELETE /comments/', () => {

  //   let comment;
  
  //   beforeAll(async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/comments')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(createComment);
  
  //     comment = res.body;
  //   });
  

  //   it('should delete a comment', async () => {
  //     const res = await request(app.getHttpServer())
  //       .delete(`/comments/`)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(comment.id);
  //     expect(res.statusCode).toBe(200);
  //   });

  //   it('should delete 404 when post ID does not exist', async () => {
  //     const res = await request(app.getHttpServer()).delete(`/comments/`).send('66556');
  //     expect(res.statusCode).toBe(404);
  //     expect(res.body).toHaveProperty('message', 'Aucun commentaire trouvé pour ce post');
  //   });


  //   it('should not delete comment without authentication', async () => {
  //     const res = await request(app.getHttpServer()).delete(`/comments/`).send(comment.id);
  //     expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });

  //   it('should not delete comment with invalid token', async () => {
  //     const res = await request(app.getHttpServer()).delete('/comments/').set('Authorization', 'Bearer invalid-token').send(comment.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token invalide');
  //   });

  //   it('should not delete comment with malformed token', async () => {
  //     const res = await request(app.getHttpServer()).delete('/comments/').set('Authorization', 'InvalidTokenFormat').send(comment.id);

  //     expect(res.statusCode).toBe(401);
  //     expect(res.body).toHaveProperty('message', 'Token manquant');
  //   });


  // });
});
