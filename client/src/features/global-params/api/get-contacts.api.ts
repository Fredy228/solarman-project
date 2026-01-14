import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import type { IGlobalParam } from "@/src/shared/types/global-param.interface";
import type { TContacts } from "../types/contacts.type";

export async function getContacts(): Promise<IGlobalParam<TContacts> | null> {
  const contactsResponse = await fetchNative.fetchAPI(
    API_ROUTES.globalParams.contacts,
    false,
    {
      method: "GET",
      next: { revalidate: 1000, tags: [CACHE_TAGS.contacts] },
    }
  );

  if (!contactsResponse?.ok) {
    console.error("Failed to fetch contacts");
    return null;
  }

  return contactsResponse.json() as Promise<IGlobalParam<TContacts>>;
}
