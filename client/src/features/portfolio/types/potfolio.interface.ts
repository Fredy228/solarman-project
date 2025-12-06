import { PartialBlock } from "@blocknote/core";

interface IPortfolioBase {
  title: string;
  tag: string;
  description: PartialBlock[];
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
