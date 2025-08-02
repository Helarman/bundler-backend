import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'", 
          "http://localhost:3000", 
          "http://localhost:5173", 
          "http://localhost:8080", 
          "https://api.mainnet-beta.solana.com", 
          "https://api.jup.ag"
        ]
      }
    }
  }));

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://bundler-frontend-tlkm.onrender.com'],
    credentials: true,
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'X-Requested-With'
    ],
    exposedHeaders: ['Authorization']
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Bundler API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(5000);
}
bootstrap();
