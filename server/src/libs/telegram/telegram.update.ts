import { Logger } from '@nestjs/common';
import { Action, Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { Message } from 'telegraf/types';

import { BlocklistService } from '../blocklist/blocklist.service';
import { PrismaService } from '../prisma/prisma.service';

@Update()
export class TelegramUpdate {
  private readonly logger = new Logger(TelegramUpdate.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly blocklist: BlocklistService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    if (ctx.chat?.type !== 'private') {
      await ctx.reply(
        "Щоб прив'язати акаунт, напишіть мені в приватні повідомлення.",
      );
      return;
    }

    await ctx.reply(
      "Щоб прив'язати акаунт, натисніть кнопку нижче й поділіться своїм номером телефону.",
      Markup.keyboard([
        Markup.button.contactRequest('📱 Поділитися номером телефону'),
      ])
        .oneTime()
        .resize(),
    );
  }

  @On('contact')
  async onContact(@Ctx() ctx: Context): Promise<void> {
    const message = ctx.message;
    const contact =
      message && 'contact' in message
        ? (message as Message.ContactMessage).contact
        : undefined;

    if (!contact) return;

    const telegramId = String(ctx.from?.id);
    const rawPhone: string = contact.phone_number ?? '';

    const normalizedIncoming = rawPhone.replace(/^\+/, '');

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone: rawPhone }, { phone: normalizedIncoming }],
      },
      select: {
        id: true,
        name: true,
        telegramId: true,
      },
    });

    if (!user) {
      await ctx.reply(
        '❌ Користувача з таким номером телефону не знайдено в системі.',
        Markup.removeKeyboard(),
      );
      return;
    }

    if (user.telegramId && user.telegramId === telegramId) {
      await ctx.reply(
        `✅ Ваш Telegram вже прив'язано до акаунта ${user.name}.`,
        Markup.removeKeyboard(),
      );
      return;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { telegramId },
    });

    this.logger.log(
      `Linked Telegram ${telegramId} to user ${user.id} (${user.name})`,
    );

    await ctx.reply(
      `✅ Акаунт успішно прив'язано! Ласкаво просимо, ${user.name}.`,
      Markup.removeKeyboard(),
    );
  }

  @Action(/^block_user:(.+)$/)
  async onBlockUser(@Ctx() ctx: Context): Promise<void> {
    const match =
      ctx.callbackQuery && 'data' in ctx.callbackQuery
        ? ctx.callbackQuery.data.match(/^block_user:(.+)$/)
        : null;

    const userId = match?.[1];
    if (!userId) {
      await ctx.answerCbQuery('❌ Помилка: userId не знайдено.');
      return;
    }

    try {
      await this.blocklist.block(userId);
      await ctx.answerCbQuery('✅ Акаунт заблоковано.');
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
      await ctx.reply(
        `🚫 Акаунт заблоковано. Усі активні сесії завершено. Щоб розблокувати акаунт, перейдіть до "Забули пароль?".`,
        {
          parse_mode: 'HTML',
        },
      );
    } catch (err) {
      this.logger.error(`Failed to block user ${userId}`, err);
      await ctx.answerCbQuery('❌ Не вдалося заблокувати акаунт.');
    }
  }
}
