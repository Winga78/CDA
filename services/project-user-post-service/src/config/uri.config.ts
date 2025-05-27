import * as dotenv from 'dotenv';
dotenv.config(); 

const isProd = process.env.NODE_ENV === 'production';

export const SERVICE_URLS = {
  user: isProd
    ? `${process.env.USER_SERVICE_BASE_URL}`
    : `${process.env.USER_SERVICE_BASE_URL}/users`,

  project: isProd
    ? `${process.env.PROJECT_SERVICE_BASE_URL}`
    : `${process.env.PROJECT_SERVICE_BASE_URL}/projects`,
};
