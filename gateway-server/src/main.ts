import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 테스트용
  app.enableCors({
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 유효성 검사 (DTO whitelist)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ConfigService 통해 포트 가져오기 (.env 의 PORT)
  const configService = app.get(ConfigService);
  const port = parseInt(process.env.PORT || '3000', 10);

  await app.listen(port);
  console.log(`Gateway Server is running on http://localhost:${port}`);
}
bootstrap();
