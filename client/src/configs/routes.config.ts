import envConfig from "./env.config";

export const URL_BASE = `${envConfig.SERVER_PROTOCOL}://${envConfig.SERVER_HOST}`;

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
  cart: "/cart",
  products: "/products",
  productsItem: (tag: string) => `/products/${tag}`,
  projects: "/projects",
  blog: "/blog",
  blogItem: (tag: string) => `/blog/${tag}`,
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
  order: {
    list: "/admin/order",
    create: "/admin/order/create",
    edit: "/admin/order/edit/:id",
    show: "/admin/order/show/:id",
  },
  blog: {
    list: "/admin/blog",
    create: "/admin/blog/create",
    edit: "/admin/blog/edit/:id",
    show: "/admin/blog/show/:id",
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
