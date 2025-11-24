import { IUser } from "../../user";

export type TLoginRequest = Pick<IUser, "email" | "password">;
