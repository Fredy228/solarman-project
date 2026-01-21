"use server";

import { revalidateTag } from "next/cache";

export async function revalidateCache(tags: string | string[]) {
  const tagsArray = Array.isArray(tags) ? tags : [tags];

  console.log(`Revalidating tags: ${tagsArray.join(", ")}`);

  tagsArray.forEach((tag) => {
    revalidateTag(tag, "max");
  });
}
