import * as dotenv from 'dotenv';
dotenv.config(); 
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from "../src/projects/projects.module";
import { Project } from '../src/projects/entities/project.entity'
import { AppModule } from '../src/app.module';

export const database  = {
    type :(process.env.DB_TYPE as any)|| "mysql",
    host : process.env.DB_HOST || "host",
    port : process.env.DB_PORT || "3306",
    username : process.env.MYSQL_USER || "db_user",
    password : process.env.MYSQL_PASSWORD || "db_password",
    database : process.env.DB_DATABASE_PROJECT || "db_database",
    entities: [Project]
}

export const api_auth_URL = `${process.env.VITE_AUTH_SERVICE_URL}`|| "http://localhost:3000/auth";
export const api_user_URL = `${process.env.VITE_USER_SERVICE_URL}`|| "http://localhost:3000/users";

export const imports = [
    TypeOrmModule.forRoot(database),
    ProjectsModule,
    AppModule,
];