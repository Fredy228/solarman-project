import type { LocalizedContent } from "@/src/shared/types/localized-content.type";

export type TContacts = {
  phone: string;
  email: string;
  address: LocalizedContent;
  link_google_maps: string | null;
  link_facebook: string | null;
  link_instagram: string | null;
  link_telegram: string | null;
  link_youtube: string | null;
};
