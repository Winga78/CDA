import { registerAs } from '@nestjs/config';

export const CONFIG_DATABASE = 'database';

export default registerAs(CONFIG_DATABASE, () => ({
  users: {
    uri: process.env.MONGODB_URI,
  },
  api_project_URL : process.env.PROJECT_DOCKER_URL||"http://localhost:3002",
  api_auth_URL : process.env.AUTH_DOCKER_URL|| "http://localhost:3000"
}));