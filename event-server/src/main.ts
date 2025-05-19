import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (Swagger 테스트 가능하도록)
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // DTO 유효성 검사
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,     
  }));

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Event API')
    .setDescription('이벤트 생성, 보상 정의, 요청 처리 API')
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
  SwaggerModule.setup('api', app, document);
  SwaggerModule.setup('/swagger-json', app, document);


  // 환경 변수에서 포트 읽기
  const configService = app.get(ConfigService);
  const port = parseInt(configService.get<string>('PORT') || '3002', 10);

  await app.listen(port);
  console.log(`Event Server is running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api`);
}
bootstrap();
