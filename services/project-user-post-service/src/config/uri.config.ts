import * as dotenv from 'dotenv';
dotenv.config(); 

const isProd = process.env.NODE_ENV === 'production';

export const SERVICE_URLS = {
  user: isProd
    ? `${process.env.VITE_USER_SERVICE_URL}`
    : `${process.env.VITE_USER_SERVICE_URL}/users`,

  project: isProd
    ? `${process.env.VITE_PROJECT_SERVICE_URL}`
    : `${process.env.VITE_PROJECT_SERVICE_URL}/projects`,
};
