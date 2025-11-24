import { IUser } from "./user.interface";

export type TUserAuth = Pick<IUser, "id" | "email" | "name" | "role"> & {
  deviceId: string;
};
