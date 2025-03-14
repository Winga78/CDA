import * as dotenv from 'dotenv';
dotenv.config(); 
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from "../src/auth/auth.module";
import { UsersModule } from "../src/users/users.module";

export const database  = process.env.MONGODB_URI || "mongodb://localhost:27017/e2e_test";
export const jwt_secret = process.env.JWT_SECRET
export const imports = [
    MongooseModule.forRoot(database),
    AuthModule,
    UsersModule
];