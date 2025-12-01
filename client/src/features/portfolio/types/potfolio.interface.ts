export interface IPortfolio {
  id?: string;
  cover: File | null | string;
  title: string;
  tag: string;
  description: string;
  images: File[] | null | string[];
  date: Date | null;
}
