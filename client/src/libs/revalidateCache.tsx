"use server";

import { revalidateTag } from "next/cache";

export async function revalidateCache(tag: string) {
  console.log(`Revalidating tag: ${tag}`);

  revalidateTag(tag, "max");
}
