import { API_ROUTES } from "@/src/configs/api-routes.config";
import apiClient from "@/src/libs/api-client";
import { TUserAuth } from "../../user";
import { TLoginRequest } from "../types/login.type";
import { TokenType } from "../types/token.type";

export const authApi = {
  async login(body: TLoginRequest): Promise<TokenType> {
    const response = await apiClient
      .getInstance()
      .post<TokenType>(API_ROUTES.auth.login, body);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.getInstance().get(API_ROUTES.auth.logout);
  },

  async check(): Promise<TUserAuth> {
    const response = await apiClient
      .getInstance()
      .get<TUserAuth>(API_ROUTES.auth.check);
    return response.data;
  },

  async changePassword(body: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.getInstance().patch(API_ROUTES.auth.changePassword, body);
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient
      .getInstance()
      .post(API_ROUTES.auth.forgotPassword, { email });
  },

  async resetPassword(body: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<void> {
    await apiClient.getInstance().post(API_ROUTES.auth.resetPassword, body);
  },
};
