import { AuthProvider } from "@refinedev/core";
import { isAxiosError } from "axios";

import { authApi } from "../features/auth";
import {
  ADMIN_AUTH_ROUTES,
  ADMIN_PROTECTED_ROUTES,
} from "../configs/routes.config";
import { buildLocalizedPath, getStoredLocale } from "../shared/utils/localized-path";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      await authApi.login({ email, password });
      return {
        success: true,
        redirectTo: buildLocalizedPath(
          getStoredLocale(),
          ADMIN_PROTECTED_ROUTES.dashboard,
        ),
      };
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        return {
          success: false,
          error: new Error("Неправильна пошта чи пароль"),
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Невідома помилка"),
      };
    }
  },
  logout: async () => {
    try {
      await authApi.logout();
      return {
        success: true,
        redirectTo: buildLocalizedPath(
          getStoredLocale(),
          ADMIN_AUTH_ROUTES.login,
        ),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Невідома помилка"),
      };
    }
  },
  check: async () => {
    try {
      await authApi.check();
      return { authenticated: true };
    } catch {
      return {
        authenticated: false,
        redirectTo: buildLocalizedPath(
          getStoredLocale(),
          ADMIN_AUTH_ROUTES.login,
        ),
        error: {
          message: "Увійдіть в систему",
          name: "Unauthorized",
        },
      };
    }
  },
  getPermissions: async () => {
    try {
      const user = await authApi.check();
      return user.role;
    } catch {
      return null;
    }
  },
  getIdentity: async () => {
    try {
      const user = await authApi.check();
      return user;
    } catch {
      return null;
    }
  },
  onError: async (error) => {
    console.error("Auth error:", error);
    return { error };
  },
};
