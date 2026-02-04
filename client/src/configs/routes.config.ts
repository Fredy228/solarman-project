export const ADMIN_AUTH_ROUTES = {
  login: "/admin/login",
};

export const PUBLIC_ROUTES = {
  index: "/",
  services: {
    home: "/services/home",
    enterprise: "/services/enterprise",
    backupPower: "/services/backup-power",
    crediting: "/services/crediting",
    income: "/services/income",
  },
  products: "/products",
  projects: "/projects",
  blog: "/blog",
  about: "/about",
  contacts: "/contacts",
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
  },
  hashtag: {
    list: "/admin/hashtag",
    create: "/admin/hashtag/create",
    edit: "/admin/hashtag/edit/:id",
  },
  contacts: "/admin/contacts",
  calculatorProfit: "/admin/calculator-profit",
  exchangeRate: "/admin/exchange-rate",
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
