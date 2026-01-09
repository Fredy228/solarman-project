import { PartialBlock } from "@blocknote/core";
import { type Dayjs } from "dayjs";

import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import { EProductStatus } from "@/src/shared/types/product-status.enum";
import { EPortfolioType } from "./portfolio-type.enum";

interface IPortfolioBase {
  id: string;
  date: string;
  images: string[];
  cover: string;
  tag: string;
  status: EProductStatus;
  type: EPortfolioType;
}

export interface IPortfolio extends IPortfolioBase {
  title: LocalizedContent;
  description: LocalizedContent;
}

export type IPortfolioItem = Pick<
  IPortfolio,
  "id" | "date" | "cover" | "title" | "tag"
>;

export interface IPortfolioLocalized extends IPortfolioBase {
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
  type: EPortfolioType;
}
