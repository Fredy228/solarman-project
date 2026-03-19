import { API_ROUTES } from "@/src/configs/api-routes.config";
import apiClient from "@/src/libs/api-client";

export type TUpdateProfileBody = {
  email?: string;
  name?: string;
  phone?: string;
};

export const userApi = {
  async updateProfile(userId: string, body: TUpdateProfileBody): Promise<void> {
    await apiClient.getInstance().patch(API_ROUTES.user.update(userId), body);
  },
};
