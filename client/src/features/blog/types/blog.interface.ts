import { PartialBlock } from "@blocknote/core";
import { type Dayjs } from "dayjs";

import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import { EProductStatus } from "@/src/shared/types/product-status.enum";

interface IBlogBase {
  id: string;
  createdAt: string;
  updatedAt: string;
  cover: string;
  tag: string;
  status: EProductStatus;
}

export interface IBlog extends IBlogBase {
  title: LocalizedContent;
  description: LocalizedContent;
  text: LocalizedContent;
}

export type IBlogItem = Pick<
  IBlog,
  "id" | "createdAt" | "updatedAt" | "cover" | "title" | "tag"
>;

export interface IBlogLocalized extends IBlogBase {
  title: string;
  description: string;
  text: string;
}

export interface IBlogForm {
  cover: File | null;
  titleUk: string;
  titleRu: string;
  descriptionUk: string;
  descriptionRu: string;
  textUk: PartialBlock[];
  textRu: PartialBlock[];
  tag: string;
  date: Dayjs | null;
}
