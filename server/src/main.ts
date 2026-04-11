import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import type { ServerResponse } from 'http';

import { MainModule } from './main.module';
import { HttpExceptionFilter } from './common/filters/http-exeption.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);

  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',') : ['*'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('/api');
  app.useStaticAssets(join(process.cwd(), 'static'), {
    prefix: '/api/static',
    setHeaders: (res: ServerResponse) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  });

  app.enableShutdownHooks();

  const PORT = configService.get<number>('PORT_SERVER') || 3000;

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
void bootstrap();
