import type { LocalizedContent } from "@/src/shared/types/localized-content.type";

export interface IHashtag {
  id: string;
  name: LocalizedContent;
  tag: string;
}

export interface IHashtagForm {
  tag: string;
  nameUk: string;
  nameRu: string;
}
