import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';

import { Language } from '../enums/language.enum';

const getLang = (acceptLanguage?: string): Language => {
  if (
    acceptLanguage &&
    Object.values(Language).includes(acceptLanguage.toLowerCase() as Language)
  )
    return acceptLanguage.toLowerCase() as Language;
  return Language.UK;
};

export const Lang = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Language => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return getLang(request?.headers['accept-language']);
  },
);
