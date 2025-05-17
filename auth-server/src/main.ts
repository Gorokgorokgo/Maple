import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // DTO에 정의되지 않은 필드는 거절 (whitelist)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger 문서 설정
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
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      url: '/api-json',
      tryItOutEnabled: true,

      // Swagger에서 Gateway로 요청을 보내야 하므로 변환
      requestInterceptor: (req) => {
        req.url = req.url.replace('http://localhost:3001', 'http://localhost:3000');
        return req;
      },
    },
  });


  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);
  console.log(`Auth Server is running on http://localhost:${port}`);
}
bootstrap();
