import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';

const telegramImports =
  process.env.TELEGRAM_TOKEN && process.env.TELEGRAM_TOKEN.trim().length > 0
    ? [
        TelegrafModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            token: config.get<string>('TELEGRAM_TOKEN') || '',
          }),
        }),
      ]
    : [];

@Module({
  imports: [ConfigModule, ...telegramImports],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
