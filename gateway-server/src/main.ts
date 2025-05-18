import { ValidationPipe } from '@nestjs/common';
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

  // 유효성 검사 (DTO whitelist)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger 문서 병합 및 설정
  const mergedDoc = await mergeSwaggerDocs();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedDoc, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  const port = parseInt(process.env.PORT || '3000', 10);

  await app.listen(port);
  console.log(`Gateway Server is running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api-docs`);
}
bootstrap();
