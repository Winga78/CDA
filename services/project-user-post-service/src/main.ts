import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // main.ts dans le service auth
app.enableCors({
  origin: '*', // ou spécifie le domaine exact en prod
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
