export const CACHE_TAGS = {
  portfolioList: "portfolio-list",
  portfolioId: (tag: string) => `portfolio-tag-${tag}`,
  blogList: "blog-list",
  blogId: (tag: string) => `blog-tag-${tag}`,
  hashtags: "hashtags",
  goodsFilters: `goods-filters`,
  goodsList: `goods-list`,
  goodsId: (tag: string) => `goods-tag-${tag}`,
  contacts: "global-params-contacts",
  calculatorProfit: "global-params-calculator-profit",
  exchangeRate: "global-params-exchange-rate",
};
