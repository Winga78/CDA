import * as dotenv from 'dotenv';
dotenv.config(); 
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostUserModule } from '../src/post-user/post-user.module';
import { AppModule } from '../src/app.module';
import { PostUser } from '../src/post-user/entities/post-user.entity';

export const database  = {
    type :(process.env.DB_TYPE as any)|| "mysql",
    host : process.env.DB_HOST || "host",
    port : process.env.DB_PORT || "3306",
    username : process.env.MYSQL_USER || "db_user",
    password : process.env.MYSQL_PASSWORD || "db_password",
    database : process.env.DB_DATABASE_RELATION || "dev_cda_project_user_post",
    entities: [PostUser]
}

export const imports = [
    TypeOrmModule.forRoot(database),
    AppModule,
    PostUserModule
];