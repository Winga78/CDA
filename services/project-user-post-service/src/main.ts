import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/project-user');
  app.setGlobalPrefix('api/post-user');
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
