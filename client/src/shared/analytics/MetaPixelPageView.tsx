"use client";

import { trackMetaPixelPageView } from "@/src/libs/meta-pixel";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackMetaPixelPageView();
  }, [pathname, searchParams]);

  return null;
}
