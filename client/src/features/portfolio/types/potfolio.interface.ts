import { PartialBlock } from "@blocknote/core";
import { type Dayjs } from "dayjs";

import { LocalizedContent } from "@/src/shared/types/localized-content.type";

interface IPortfolioBase {
  id: string;
  date: string;
  images: string[];
  cover: string;
  tag: string;
}

export interface IPortfolio extends IPortfolioBase {
  title: LocalizedContent;
  description: LocalizedContent;
}

export interface IPortfolioLocalozed extends IPortfolioBase {
  title: string;
  description: string;
}

export interface IPortfolioForm {
  date: Dayjs | null;
  images: File[] | null;
  cover: File | null;
  titleUk: string;
  titleRu: string;
  descriptionUk: PartialBlock[];
  descriptionRu: PartialBlock[];
  tag: string;
}
