"use server";

import { revalidateTag } from "next/cache";

export async function revalidateCache(tags: string | string[]) {
  const tagsArray = Array.isArray(tags) ? tags : [tags];

  for (const tag of tagsArray) {
    revalidateTag(tag, "max");
  }
}
