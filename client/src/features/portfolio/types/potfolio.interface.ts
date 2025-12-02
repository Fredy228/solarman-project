interface IPortfolioBase {
  title: string;
  tag: string;
  description: string;
}

export interface IPortfolio extends IPortfolioBase {
  id: string;
  date: string;
  images: string[];
  cover: string;
}

export interface IPortfolioForm extends IPortfolioBase {
  date: string | null;
  images: File[] | null;
  cover: File | null;
}
