import type { ELocale } from "@/src/i18n/routing";
import type { EOrderType } from "./order-type.enum";
import type { UTMTagsType } from "./utmTags.type";

export interface IOrder {
  id: number;
  email: string | null;
  name: string;
  phone: string;
  notes: string | null;
  lang: ELocale;
  utmTags: UTMTagsType | null;
  pageId: number | null;
  type: EOrderType | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderForm {
  email: string | null;
  name: string;
  phone: string;
  notes: string | null;
  type: EOrderType | null;
}

export interface IOrderRequest extends IOrderForm {
  utmTags: UTMTagsType | null;
  pageUrl: string;
}
