import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';
import { Language } from '../enums/language.enum';

const validateLang = (lang?: string): Language | null => {
  if (
    lang &&
    Object.values(Language).includes(lang.toLowerCase() as Language)
  ) {
    return lang.toLowerCase() as Language;
  }
  return null;
};

export const Lang = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Language => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const cookieLang = request.cookies?.['NEXT_LOCALE'] as string;
    const validCookieLang = validateLang(cookieLang);

    if (validCookieLang) {
      return validCookieLang;
    }

    const headerLang = request.headers['accept-language'];
    const validHeaderLang = validateLang(headerLang);

    if (validHeaderLang) {
      return validHeaderLang;
    }

    return Language.UK;
  },
);
