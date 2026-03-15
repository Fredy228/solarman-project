"use client";

import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useState,
} from "react";

export type TBlogSortMode = "newest" | "oldest";

export default function BlogToolbar() {
  const t = useTranslations("blog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    () => searchParams.get("title_like") ?? "",
  );

  const updateQuery = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      updater(params);
      params.delete("page");
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const currentOrder = searchParams.get("_order") ?? "desc";
  const sortMode: TBlogSortMode = currentOrder === "asc" ? "oldest" : "newest";

  const handleApplySearch = () => {
    updateQuery((params) => {
      const normalized = searchValue.trim();
      if (normalized) {
        params.set("title_like", normalized);
      } else {
        params.delete("title_like");
      }
    });
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleApplySearch();
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as TBlogSortMode;
    updateQuery((params) => {
      params.set("_order", value === "oldest" ? "asc" : "desc");
    });
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 2 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        mb: 3,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 500px) 1fr" },
        gap: 2,
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder={t("search.placeholder")}
          slotProps={{
            input: {
              startAdornment: (
                <Search size={16} style={{ marginRight: 6, opacity: 0.5 }} />
              ),
              endAdornment: searchValue ? (
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchValue("");
                    updateQuery((params) => params.delete("title_like"));
                  }}
                >
                  <X size={14} />
                </IconButton>
              ) : null,
            },
          }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={handleApplySearch}
          sx={{ whiteSpace: "nowrap" }}
        >
          {t("search.button")}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "flex-start", md: "flex-end" },
        }}
      >
        <TextField
          select
          size="small"
          label={t("sort.label")}
          value={sortMode}
          onChange={handleSortChange}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="newest">{t("sort.newest")}</MenuItem>
          <MenuItem value="oldest">{t("sort.oldest")}</MenuItem>
        </TextField>
      </Box>
    </Box>
  );
}
