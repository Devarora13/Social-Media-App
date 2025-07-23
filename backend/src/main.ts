import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3000'], // Support both frontend ports
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(3001); // Changed to port 3001 to avoid conflict
  console.log('🚀 Backend server running on http://localhost:3001');
}
bootstrap();
