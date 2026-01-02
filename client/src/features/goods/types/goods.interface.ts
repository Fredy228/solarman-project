import { EProductStatus } from "@/src/shared/types/product-status.enum";
import { EGoodsCategory } from "@/src/features/goods/types/goods-category.enum";
import { ECurrency } from "@/src/shared/types/currency.enum";
import { EBadgeType } from "@/src/features/goods/types/goods-badge-type.enum";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import { PartialBlock } from "@blocknote/core";
import {
  TBatterySpecs,
  TChargeStationSpecs,
  TFastenerSpecs,
  TInvertorSpecs,
  TPanelSpecs,
  TReadyMadeSolutionSpecs,
} from "@/src/features/goods/types/goods-spec.type";
import { PdfInfo } from "@/src/features/goods";

interface IGoodsBase {
  id: string;
  cover: string;
  images: string[];
  instructions: PdfInfo[];
  tag: string;
  status: EProductStatus;
  price: number;
  discountPrice?: number;
  currency: ECurrency;
  badge?: EBadgeType;
  country?: string;
}

interface IGoodsPanel extends IGoodsBase {
  category: EGoodsCategory.PANEL;
  specs?: TPanelSpecs | null;
}
interface IGoodsInvertor extends IGoodsBase {
  category: EGoodsCategory.INVERTOR;
  specs?: TInvertorSpecs | null;
}
interface IGoodsBattery extends IGoodsBase {
  category: EGoodsCategory.BATTERY;
  specs?: TBatterySpecs | null;
}
interface IGoodsFastener extends IGoodsBase {
  category: EGoodsCategory.FASTENER;
  specs?: TFastenerSpecs | null;
}
interface IGoodsChargeStation extends IGoodsBase {
  category: EGoodsCategory.CHARGE_STATION;
  specs?: TChargeStationSpecs | null;
}
interface IGoodsReadyMadeSolution extends IGoodsBase {
  category: EGoodsCategory.READY_MADE_SOLUTION;
  specs?: TReadyMadeSolutionSpecs | null;
}
interface IGoodsComponent extends IGoodsBase {
  category: EGoodsCategory.COMPONENT;
  specs?: null;
}

type IGoodsPre =
  | IGoodsPanel
  | IGoodsInvertor
  | IGoodsBattery
  | IGoodsFastener
  | IGoodsChargeStation
  | IGoodsReadyMadeSolution
  | IGoodsComponent;

export type IGoods = {
  title: LocalizedContent;
  description: LocalizedContent;
} & IGoodsPre;

export type IGoodsLocalized = {
  title: string;
  description: string;
} & IGoodsPre;

export interface IGoodsForm {
  cover: File | null;
  images: File[] | null;
  instructions: File[] | null;
  titleUk: string;
  titleRu: string;
  descriptionUk: PartialBlock[];
  descriptionRu: PartialBlock[];
  tag: string;
  category: EGoodsCategory | "";
  price: string;
  discountPrice: string;
  currency: ECurrency | "";
  badge?: EBadgeType | "";
  country?: string | "";
  specs?:
    | TBatterySpecs
    | TChargeStationSpecs
    | TFastenerSpecs
    | TInvertorSpecs
    | TPanelSpecs
    | TReadyMadeSolutionSpecs
    | null;
}
