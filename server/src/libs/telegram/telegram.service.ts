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

  async sendLoginAlert(params: {
    telegramId: string;
    userId: string;
    name: string;
    email: string;
    ip: string;
    browser?: string;
    os?: string;
    platform?: string;
  }): Promise<void> {
    if (!this.enabled) return;

    const { telegramId, userId, name, email, ip, browser, os, platform } =
      params;

    const now = new Date().toLocaleString('uk-UA', {
      timeZone: 'Europe/Kyiv',
      dateStyle: 'short',
      timeStyle: 'medium',
    });

    const device =
      [browser, os, platform].filter(Boolean).join(' / ') ||
      'Невідомий пристрій';

    const message =
      `🔐 <b>Новий вхід в акаунт</b>\n\n` +
      `👤 <b>Акаунт:</b> ${name} (${email})\n` +
      `🕐 <b>Час:</b> ${now}\n` +
      `🌐 <b>IP-адреса:</b> <code>${ip}</code>\n` +
      `🖥️ <b>Пристрій:</b> ${device}\n\n` +
      `Це були ви? Якщо ні — заблокуйте акаунт та змініть пароль.`;

    try {
      await this.bot!.telegram.sendMessage(telegramId, message, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚫 Заблокувати акаунт',
                callback_data: `block_user:${userId}`,
              },
            ],
          ],
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to send login alert to telegramId ${telegramId}`,
        error as Error,
      );
    }
  }

  async sendPasswordResetCode(
    telegramId: string,
    code: string,
    name: string,
  ): Promise<void> {
    if (!this.enabled) return;

    const message =
      `🔑 <b>Скидання паролю</b>\n\n` +
      `👤 <b>Акаунт:</b> ${name}\n\n` +
      `Ваш код для скидання паролю:\n` +
      `<code>${code}</code>\n\n` +
      `⚠️ Код дійсний протягом <b>15 хвилин</b>.\n` +
      `Якщо ви не запитували скидання паролю — проігноруйте це повідомлення.`;

    try {
      await this.bot!.telegram.sendMessage(telegramId, message, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      this.logger.error(
        `Failed to send password reset code to telegramId ${telegramId}`,
        error as Error,
      );
      throw error;
    }
  }
}
