import { User } from '@prisma/client';

export type TUserPublic = Pick<
  User,
  'id' | 'name' | 'role' | 'email' | 'phone'
>;

export type TUserAuth = TUserPublic & {
  deviceId: string;
};
