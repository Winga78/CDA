import * as dotenv from 'dotenv';
dotenv.config(); 
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUserModule } from "../src/project-user/project-user.module";
import { AppModule } from '../src/app.module';
import { ProjectUser } from '../src/project-user/entities/project-user.entity';

export const database  = {
    type :(process.env.DB_TYPE as any)|| "mysql",
    host : process.env.DB_HOST || "host",
    port : process.env.DB_PORT || "3306",
    username : process.env.MYSQL_USER || "db_user",
    password : process.env.MYSQL_PASSWORD || "db_password",
    database : process.env.DB_DATABASE_RELATION || "db_database",
    entities: [ProjectUser]
}

export const api_project_URL = process.env.VITE_PROJECT_SERVICE_URL||"http://localhost:3002/projects";
export const api_auth_URL = process.env.VITE_AUTH_SERVICE_URL|| "http://localhost:3000/auth";
export const api_user_URL = process.env.VITE_USER_SERVICE_URL|| "http://localhost:3000/users";
export const api_chat_URL = process.env.VITE_CHAT_SERVICE_URL|| "http://localhost:3001/posts";

export const imports = [
    TypeOrmModule.forRoot(database),
    AppModule,
    ProjectUserModule,
];