import { Request } from 'express';
import { TUserAuth } from './user.type';

export type ProtectReqType = Request & {
  user: TUserAuth;
};
