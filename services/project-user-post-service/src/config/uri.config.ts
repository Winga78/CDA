import * as dotenv from 'dotenv';
dotenv.config(); 

export const SERVICE_URLS = {
  user:`${process.env.VITE_USER_SERVICE_URL}`,
  project:`${process.env.VITE_PROJECT_SERVICE_URL}`,
};
