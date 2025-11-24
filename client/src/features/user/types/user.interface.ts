import { EUserRole } from "./user-role";

export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: EUserRole;
}
