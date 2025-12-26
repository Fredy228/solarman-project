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

interface IGoodsBase {
  id: string;
  cover: string;
  images: string[];
  instructions: string[];
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
  specs: TPanelSpecs;
}
interface IGoodsInvertor extends IGoodsBase {
  category: EGoodsCategory.INVERTOR;
  specs: TInvertorSpecs;
}
interface IGoodsBattery extends IGoodsBase {
  category: EGoodsCategory.BATTERY;
  specs: TBatterySpecs;
}
interface IGoodsFastener extends IGoodsBase {
  category: EGoodsCategory.FASTENER;
  specs: TFastenerSpecs;
}
interface IGoodsChargeStation extends IGoodsBase {
  category: EGoodsCategory.CHARGE_STATION;
  specs: TChargeStationSpecs;
}
interface IGoodsReadyMadeSolution extends IGoodsBase {
  category: EGoodsCategory.READY_MADE_SOLUTION;
  specs: TReadyMadeSolutionSpecs;
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
  status: EProductStatus;
  category: EGoodsCategory;
  price: number;
  discountPrice?: number | null;
  currency: ECurrency;
  badge?: EBadgeType | null;
  country?: string | null;
}
