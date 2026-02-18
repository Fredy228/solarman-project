import type { UTMTagsType } from "@/src/features/order/types/utmTags.type";

const UTM_STORAGE_KEY = "utm_tags";

export const utmStorage = {
  save(utmTags: UTMTagsType): void {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmTags));
    } catch (error) {
      console.error("Failed to save UTM tags:", error);
    }
  },

  get(): UTMTagsType | null {
    if (typeof window === "undefined") return null;

    try {
      const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return Object.keys(parsed).length > 0 ? parsed : null;
    } catch (error) {
      console.error("Failed to get UTM tags:", error);
      return null;
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.removeItem(UTM_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear UTM tags:", error);
    }
  },

  extractFromUrl(searchParams: URLSearchParams): UTMTagsType | null {
    const utmTags: UTMTagsType = {};
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ] as const;

    utmKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        utmTags[key] = value;
      }
    });

    return Object.keys(utmTags).length > 0 ? utmTags : null;
  },
};
