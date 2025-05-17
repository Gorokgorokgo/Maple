import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // DTO에 정의되지 않은 필드 자동 제거 옵션
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('회원가입 및 인증 API 문서')
    .setVersion('1.0')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access-token', 
  )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
