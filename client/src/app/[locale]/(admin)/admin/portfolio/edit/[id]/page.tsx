"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const PortfolioEditForm = dynamic(
  () =>
    import("@/src/features/portfolio/components/PortfolioEditForm").then(
      (mod) => mod.PortfolioEditForm,
    ),
  {
    ssr: false,
  },
);

export default function PortfolioEditPage() {
  return (
    <Suspense>
      <PortfolioEditForm />
    </Suspense>
  );
}
