import * as dotenv from 'dotenv';
dotenv.config(); 

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'jwt_token_secret',
};
