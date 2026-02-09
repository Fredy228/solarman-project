import type { StaticImageData } from "next/image";

export type BenefitWithImgItemType = {
  id: number;
  title: string;
  text: string;
  img: StaticImageData;
};
