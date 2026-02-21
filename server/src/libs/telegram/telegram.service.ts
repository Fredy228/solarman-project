import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { UserErorMessage } from '../../common/messages/error/user.message';
import { CustomHttpExceptionUtil } from '../../helpers/custom-http-exection.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelegramService {
  readonly logger = new Logger(TelegramService.name);
  private readonly chatId: string;

  constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID') || '';
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.chatId) {
      this.logger.warn('TELEGRAM_CHAT_ID is not set, skipping message');
      return;
    }

    try {
      await this.bot.telegram.sendMessage(this.chatId, message, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      this.logger.error('Failed to send Telegram message', error);
    }
  }

  async sendMessageToUser(userId: string, message: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { telegramId: true, name: true },
    });

    if (!user) {
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        UserErorMessage.NOT_FOUND,
      );
    }

    if (!user.telegramId) {
      this.logger.warn(
        `User ${userId} (${user.name}) has no linked Telegram account`,
      );
      return;
    }

    try {
      await this.bot.telegram.sendMessage(user.telegramId, message, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      this.logger.error(
        `Failed to send Telegram message to user ${userId}`,
        error,
      );
    }
  }
}
