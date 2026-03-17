import { EUserRole } from "./user-role";

export interface IUser {
  id: string;
  email?: string | null;
  name: string;
  password: string;
  role: EUserRole | null;
  isBlocked: boolean;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserForm {
  email: string;
  name: string;
  phone?: string | null;
  password?: string | null;
  role: EUserRole | null;
  isBlocked: boolean;
}
