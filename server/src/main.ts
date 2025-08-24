import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Security
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS
  app.enableCors({
    origin: [configService.get('CLIENT_URL')],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Compression
  app.use(compression());

  // Cookie parser
  app.use(cookieParser(configService.get('COOKIE_SECRET')));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Trust proxy for rate limiting
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  const port = configService.get('PORT') || 3100;
  await app.listen(port);

  console.log(`🚀 Madarik NestJS API server running on port ${port}`);
  console.log(`📍 Environment: ${configService.get('NODE_ENV')}`);
  console.log(`🌐 Client URL: ${configService.get('CLIENT_URL')}`);
  
  if (configService.get('NODE_ENV') === 'development') {
    console.log(`📖 API Health: http://localhost:${port}/api/v1/health`);
  }
}

bootstrap();
