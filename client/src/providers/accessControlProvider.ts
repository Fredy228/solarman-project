import { AccessControlProvider } from "@refinedev/core";

import { EUserRole, IUser } from "@/src/features/user";
import { authProvider } from "./authProvider";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const identity = await authProvider.getIdentity?.();
    const user = identity as IUser | null;
    const role = user?.role;

    if (!role) {
      return { can: false };
    }

    if (role === EUserRole.ADMIN || role === EUserRole.TECHNICIAN) {
      return { can: true };
    }

    if (role === EUserRole.MODERATOR) {
      if (resource === "user") {
        return { can: false };
      }
      return { can: true };
    }

    return { can: false };
  },
};
