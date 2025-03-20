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
export const jwt_secret = process.env.JWT_SECRET
export const imports = [
    TypeOrmModule.forRoot(database),
    PostsModule,
    AppModule,
];