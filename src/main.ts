import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Some Configuration for API (Not about Swagger)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.enableCors({
    origin: ['http://localhost:4202', 'http://10.76.100.50:4202','http://10.71.0.24:4202','http://10.71.0.24', 'http://ctim.cpg.com.tn'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Setting API Path
  const apiPath = 'api';
  app.setGlobalPrefix(apiPath);

  // Swagger Options
  /* const options = new DocumentBuilder()
    .addCookieAuth()
    .setTitle('Squad Dev Swagger API')
    .setDescription('Squad Dev Swagger API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // Swagger path: http://localhost:3200/api/docs
  SwaggerModule.setup(`${apiPath}`, app, document); */

  app.use(cookieParser());
  await app.listen(3002);
}

bootstrap();
