import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as swaggerUi from 'swagger-ui-express';
import { AppModule } from './app.module';
import { mergeSwaggerDocs } from './utils/merge-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 테스트용
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.setGlobalPrefix('api');
  // 유효성 검사 (DTO whitelist)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger 문서 병합 및 설정
  const mergedDoc = await mergeSwaggerDocs();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedDoc, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  // Swagger UI 띄우기
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedDoc));


  // ConfigService 통해 포트 가져오기 (.env 의 PORT)
  const configService = app.get(ConfigService);
  const port = parseInt(process.env.PORT || '3000', 10);

  await app.listen(port);
  console.log(`Gateway Server is running on http://localhost:${port}`);
}
bootstrap();
