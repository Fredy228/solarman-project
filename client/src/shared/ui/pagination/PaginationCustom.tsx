"use client";

import { Box, Pagination, PaginationItem } from "@mui/material";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  count: number;
  page: number;
};

export default function PaginationCustom({ count, page }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Box className="flex justify-center mb-5">
      <Pagination
        color="primary"
        page={page}
        count={count}
        sx={{
          "& .MuiPaginationItem-root.Mui-selected": {
            color: "var(--color-text-light)",
          },
        }}
        renderItem={(item) => {
          const currentParams = new URLSearchParams(searchParams.toString());

          if (item.page) {
            currentParams.set("page", item.page.toString());
          }

          const href = `${pathname}?${currentParams.toString()}`;

          return <PaginationItem component={Link} href={href} {...item} />;
        }}
      />
    </Box>
  );
}
