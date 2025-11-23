import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const IpAddress = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request>();

    const ipSource = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];

    if (!ipSource) {
      return 'unknown';
    }

    if (Array.isArray(ipSource)) {
      return ipSource[0];
    }

    return ipSource.split(',')[0].trim();
  },
);
