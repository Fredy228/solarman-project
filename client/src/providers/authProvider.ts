import { AuthProvider } from "@refinedev/core";
import { isAxiosError } from "axios";

import { authApi } from "../features/auth";
import type { TUserAuth } from "../features/user";
import {
  ADMIN_AUTH_ROUTES,
  ADMIN_PROTECTED_ROUTES,
} from "../configs/routes.config";
import { buildLocalizedPath, getStoredLocale } from "../shared/utils/localized-path";

// Refine checks access for every row button; share their identity lookup.
const IDENTITY_CACHE_MS = 10_000;
let cachedIdentity: { user: TUserAuth; expiresAt: number } | null = null;
let pendingIdentity: Promise<TUserAuth | null> | null = null;
let identityCacheVersion = 0;

function clearIdentityCache() {
  identityCacheVersion += 1;
  cachedIdentity = null;
  pendingIdentity = null;
}

function getIdentity(): Promise<TUserAuth | null> {
  if (cachedIdentity && cachedIdentity.expiresAt > Date.now()) {
    return Promise.resolve(cachedIdentity.user);
  }

  if (!pendingIdentity) {
    const requestVersion = identityCacheVersion;
    pendingIdentity = authApi
      .check()
      .then((user) => {
        if (requestVersion !== identityCacheVersion) return null;
        cachedIdentity = { user, expiresAt: Date.now() + IDENTITY_CACHE_MS };
        return user;
      })
      .catch(() => null)
      .finally(() => {
        if (requestVersion === identityCacheVersion) pendingIdentity = null;
      });
  }

  return pendingIdentity;
}

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      await authApi.login({ email, password });
      clearIdentityCache();
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
    clearIdentityCache();
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
  getIdentity,
  onError: async (error) => {
    console.error("Auth error:", error);
    return { error };
  },
};
