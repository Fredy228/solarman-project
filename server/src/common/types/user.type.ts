import { User } from '@prisma/client';

export interface TUserAuth
  extends Pick<User, 'id' | 'name' | 'role' | 'email'> {
  deviceId: string;
}
