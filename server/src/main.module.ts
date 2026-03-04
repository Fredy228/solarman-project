import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

import { envSchema } from './configs/env.config';
import { jwtConfig } from './configs/jwt.config';

import { ApiModule } from './api/api.module';
import { FileModule } from './libs/file/file.module';
import { PrismaModule } from './libs/prisma/prisma.module';
import { TelegramModule } from './libs/telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => jwtConfig(config),
    }),
    PrismaModule,
    ApiModule,
    TelegramModule,
    ScheduleModule.forRoot(),
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
