export const ADMIN_AUTH_ROUTES = {
  login: "/admin/login",
};

export const PUBLIC_ROUTES = {
  index: "/",
};

export const ADMIN_PROTECTED_ROUTES = {
  dashboard: "/admin",
  portfolio: {
    list: "/admin/portfolio",
    create: "/admin/portfolio/create",
    edit: "/admin/portfolio/edit/:id",
    show: "/admin/portfolio/show/:id",
  },
  goods: {
    list: "/admin/goods",
    create: "/admin/goods/create",
    edit: "/admin/goods/edit/:id",
    show: "/admin/goods/show/:id",
  },
  goodsBrand: {
    list: "/admin/goods-brand",
    create: "/admin/goods-brand/create",
    edit: "/admin/goods-brand/edit/:id",
    show: "/admin/goods-brand/show/:id",
  },
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
