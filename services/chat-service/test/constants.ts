import * as dotenv from 'dotenv';
dotenv.config(); 
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from "../src/posts/posts.module";
import { Post } from '../src/posts/entities/post.entity'
import { AppModule } from '../src/app.module';

export const database  = {
    type : (process.env.DB_TYPE as any)|| "mysql",
    host : process.env.DB_HOST || "localhos",
    port : process.env.DB_PORT || "3306",
    username : process.env.MYSQL_USER || "db_user",
    password : process.env.MYSQL_PASSWORD || "db_password",
    database : process.env.DB_DATABASE_CHAT || "db_database",
    entities: [Post]
}

export const api_project_URL = process.env.PROJECT_DOCKER_URL||"http://localhost:3002";
export const api_auth_URL = process.env.AUTH_DOCKER_URL|| "http://localhost:3000";

export const imports = [
    TypeOrmModule.forRoot(database),
    PostsModule,
    AppModule,
];