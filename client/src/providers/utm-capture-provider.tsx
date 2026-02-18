"use client";

import { utmStorage } from "@/src/libs/utm-storage";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function UtmCaptureProvider() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmTags = utmStorage.extractFromUrl(searchParams);

    if (utmTags) {
      utmStorage.save(utmTags);
    }
  }, [searchParams]);

  return null;
}
