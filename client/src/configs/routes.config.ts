export const ADMIN_AUTH_ROUTES = {
  login: "/admin/login",
};

export const PUBLIC_ROUTES = {
  index: "/",
};

export const ADMIN_PROTECTED_ROUTES = {
  dashboard: "/admin",
};

const ROUTES = {
  admin: {
    ...ADMIN_AUTH_ROUTES,
    ...ADMIN_PROTECTED_ROUTES,
  },
  public: {
    ...PUBLIC_ROUTES,
  },
};

export default ROUTES;
