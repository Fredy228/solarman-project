import apiClient from "@/src/libs/api-client";
import { TLoginRequest } from "../types/login.type";
import { API_ROUTES } from "@/src/configs/api-routes.config";
import { TokenType } from "../types/token.type";
import { TUserAuth } from "../../user";

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
};
