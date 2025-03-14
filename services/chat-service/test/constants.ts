import * as dotenv from 'dotenv';
dotenv.config(); 
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from "../src/comments/comments.module";
import { MediasModule } from "../src/medias/medias.module";
import { PostsModule } from "../src/posts/posts.module";

export const database  = {
    type : (process.env.DB_TYPE as any)|| "mysql",
    host : process.env.DB_HOST || "localhos",
    port : process.env.DB_PORT || "3306",
    username : process.env.DB_USER || "db_user",
    password : process.env.DB_PASSWORD || "db_password",
    database : process.env.DB_DATABASE || "db_database",
}
export const jwt_secret = process.env.JWT_SECRET
export const imports = [
    TypeOrmModule.forRoot(database),
    CommentsModule,
    MediasModule,
    PostsModule
];