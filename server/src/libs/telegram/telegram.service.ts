import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramService {
  readonly logger = new Logger(TelegramService.name);

  private readonly chatId: string;
  private readonly enabled: boolean;

  constructor(
    @Optional() @InjectBot() private readonly bot: Telegraf | undefined,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_TOKEN')?.trim();
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID') || '';
    this.enabled = !!token && !!this.bot;

    if (!this.enabled) {
      this.logger.warn('Telegram bot disabled: missing token or bot instance');
    }
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.enabled) return;
    if (!this.chatId) {
      this.logger.warn('TELEGRAM_CHAT_ID is not set, skipping message');
      return;
    }

    try {
      await this.bot!.telegram.sendMessage(this.chatId, message, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      this.logger.error('Failed to send Telegram message', error as Error);
    }
  }

  async sendMessageToUser(telegramId: string, message: string): Promise<void> {
    if (!this.enabled) return;

    try {
      await this.bot!.telegram.sendMessage(telegramId, message, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      this.logger.error(
        `Failed to send Telegram message to telegramId ${telegramId}`,
        error as Error,
      );
    }
  }
}
