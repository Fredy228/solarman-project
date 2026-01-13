import type { LocalizedContent } from '@prisma/client';

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
