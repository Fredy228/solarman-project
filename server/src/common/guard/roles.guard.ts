import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@prisma/client';
import { ProtectReqType } from '../types/request.type';
import { TUserAuth } from '../types/user.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || roles.length === 0) {
      return true;
    }

    const request: ProtectReqType = context.switchToHttp().getRequest();

    const user: TUserAuth = request?.user;
    if (!user) return false;
    if (user.role === Role.TECHNICIAN) return true;

    return roles.includes(user.role);
  }
}
