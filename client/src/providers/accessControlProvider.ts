import { AccessControlProvider } from "@refinedev/core";

import { authProvider } from "./authProvider";
import { EUserRole, IUser } from "@/src/features/user";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const identity = await authProvider.getIdentity?.();
    const user = identity as IUser | null;
    const role = user?.role;

    if (!role) {
      return { can: false };
    }

    if (role === EUserRole.ADMIN) {
      return { can: true };
    }

    if (role === EUserRole.MODERATOR) {
      if (resource === "users") {
        return { can: false };
      }
      return { can: true };
    }

    if (role === EUserRole.ANALYST) {
      if (action === "list" || action === "show") {
        return { can: true };
      }
    }

    return { can: false };
  },
};
