"use client";

import { Box, Button, IconButton, MenuItem, TextField } from "@mui/material";
import { Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { EGoodsCategory } from "@/src/features/goods/types/goods-category.enum";
import { buildLocalizedPath } from "@/src/shared/utils/localized-path";

export type TGoodsSortMode = "default" | "price_desc" | "price_asc";

export type TGoodsShopToolbarFilters = {
  title_like: string;
  sortMode: TGoodsSortMode;
  category: EGoodsCategory;
};

type GoodsShopToolbarProps = {
  onFiltersChange?: (filters: TGoodsShopToolbarFilters) => void;
  fixedCategory?: EGoodsCategory;
  hideCategorySelect?: boolean;
  categoryOptions?: Array<{
    value: EGoodsCategory;
    label: string;
    href?: string;
  }>;
};

const isGoodsCategory = (value: string | null): value is EGoodsCategory => {
  if (!value) return false;
  return Object.values(EGoodsCategory).includes(value as EGoodsCategory);
};

const getSortModeFromQuery = (
  sort: string | null,
  order: string | null,
): TGoodsSortMode => {
  if (sort === "price" && order === "asc") return "price_asc";
  if (sort === "price" && order === "desc") return "price_desc";
  return "default";
};

export const GoodsShopToolbar: FC<GoodsShopToolbarProps> = ({
  onFiltersChange,
  fixedCategory,
  hideCategorySelect = false,
  categoryOptions: categoryOptionsProp,
}) => {
  const t = useTranslations("refine");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<TGoodsShopToolbarFilters>(() => {
    const categoryFromQuery = searchParams.get("category");
    const category =
      fixedCategory ??
      (isGoodsCategory(categoryFromQuery)
        ? categoryFromQuery
        : EGoodsCategory.PANEL);

    return {
      title_like: searchParams.get("title_like") ?? "",
      sortMode: getSortModeFromQuery(
        searchParams.get("_sort"),
        searchParams.get("_order"),
      ),
      category,
    };
  }, [fixedCategory, searchParams]);

  const [searchValue, setSearchValue] = useState(
    () => searchParams.get("title_like") ?? "",
  );

  const updateQuery = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      updater(params);
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const setSortInQuery = (params: URLSearchParams, mode: TGoodsSortMode) => {
    if (mode === "price_asc") {
      params.set("_sort", "price");
      params.set("_order", "asc");
      return;
    }

    if (mode === "price_desc") {
      params.set("_sort", "price");
      params.set("_order", "desc");
      return;
    }

    params.delete("_sort");
    params.delete("_order");
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const handleApplySearch = () => {
    updateQuery((params) => {
      const normalizedSearchValue = searchValue.trim();

      if (!normalizedSearchValue) {
        params.delete("title_like");
        return;
      }

      params.set("title_like", normalizedSearchValue);
    });
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    handleApplySearch();
  };

  const handleSortModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as TGoodsSortMode;
    updateQuery((params) => {
      setSortInQuery(params, value);
    });
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as EGoodsCategory;
    const option = categoryOptionsProp?.find((item) => item.value === value);

    if (option?.href) {
      router.replace(buildLocalizedPath(locale, option.href), {
        scroll: false,
      });
      return;
    }

    updateQuery((params) => {
      params.set("category", value);
    });
  };

  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const locale = useLocale();

  const sortModeLabel = t("goods.sort.default");
  const sortLabel = locale === "uk" ? "Сортування" : "Сортировка";

  const searchFieldLabel = t("goods.fields.title");

  const categoryLabel = t("goods.fields.category");

  const priceLabel = t("goods.fields.price");
  const priceDescLabel =
    locale === "uk"
      ? `${priceLabel} (за спаданням)`
      : `${priceLabel} (по убыванию)`;
  const priceAscLabel =
    locale === "uk"
      ? `${priceLabel} (за зростанням)`
      : `${priceLabel} (по возрастанию)`;

  const findLabel = t("buttons.find");

  const categoryTitlePrefix = "goods.category.";

  const titlePlaceholder = t("goods.fields.title");

  const categoryOptions =
    categoryOptionsProp ??
    Object.values(EGoodsCategory).map((category) => ({
      value: category,
      label: t(`${categoryTitlePrefix}${category}`),
    }));

  const toolbarGridTemplateColumns = {
    xs: "1fr",
    md: hideCategorySelect
      ? "minmax(0, 500px) minmax(200px, 240px)"
      : "minmax(0, 500px) 1fr",
  };

  return (
    <Box
      sx={{
        p: { xs: 1, md: 1.5 },
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "secondary.main",
        color: "var(--color-text-light)",
        boxShadow: 1,
        display: "grid",
        gridTemplateColumns: toolbarGridTemplateColumns,
        gap: 1,
        alignItems: "center",
        mb: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          handleApplySearch();
        }}
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 1,
          alignItems: "center",
          width: "100%",
          maxWidth: { md: 500 },
          justifySelf: { md: "start" },
        }}
      >
        <TextField
          size="small"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          label={searchFieldLabel}
          placeholder={titlePlaceholder}
          fullWidth
          sx={{
            "& .MuiInputBase-root": { backgroundColor: "transparent" },
            "& .MuiInputBase-root:hover .MuiInputBase-input": {
              color: "var(--color-text-light)",
            },
            "& .MuiInputBase-input": {
              color: "var(--color-text-light)",
              fontSize: "0.875rem",
              "&::placeholder": { color: "rgba(255, 255, 255, 0.75)" },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.35)",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "rgba(255, 255, 255, 0.8)",
              },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.8)",
            },
            "& .MuiInputAdornment-root svg": {
              color: "var(--color-text-light)",
            },
            "& .MuiSvgIcon-root": { color: "var(--color-text-light)" },
          }}
          slotProps={{
            inputLabel: {
              sx: {
                color: "var(--color-text-light)",
                "&.Mui-focused": { color: "var(--color-text-light)" },
              },
            },
            input: {
              startAdornment: (
                <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                  <Search size={16} color="var(--color-text-light)" />
                </Box>
              ),
              endAdornment: searchValue ? (
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchValue("");
                    updateQuery((params) => params.delete("title_like"));
                  }}
                  sx={{ color: "var(--color-text-light)" }}
                >
                  <X size={14} />
                </IconButton>
              ) : null,
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="small"
          sx={{ minHeight: 40, px: 2.5, whiteSpace: "nowrap" }}
        >
          {findLabel}
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: hideCategorySelect
              ? "minmax(200px, 1fr)"
              : "repeat(2, minmax(200px, 1fr))",
          },
          gap: 1,
          justifySelf: { md: "end" },
          width: { xs: "100%", md: "auto" },
          maxWidth: { md: 420 },
        }}
      >
        <TextField
          size="small"
          select
          value={filters.sortMode}
          onChange={handleSortModeChange}
          label={sortLabel}
          fullWidth
          slotProps={{
            inputLabel: {
              sx: {
                color: "var(--color-text-light)",
                "&.Mui-focused": { color: "var(--color-text-light)" },
              },
            },
          }}
          sx={{
            minWidth: { md: 200 },
            "& .MuiInputBase-root": { backgroundColor: "transparent" },
            "& .MuiInputBase-root:hover .MuiInputBase-input": {
              color: "var(--color-text-light)",
            },
            "& .MuiInputBase-input": {
              color: "var(--color-text-light)",
              fontSize: "0.875rem",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.35)",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "rgba(255, 255, 255, 0.8)",
              },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.8)",
            },
            "& .MuiSvgIcon-root": { color: "var(--color-text-light)" },
          }}
        >
          <MenuItem value="default">{sortModeLabel}</MenuItem>
          <MenuItem value="price_desc">{priceDescLabel}</MenuItem>
          <MenuItem value="price_asc">{priceAscLabel}</MenuItem>
        </TextField>

        {!hideCategorySelect && (
          <TextField
            size="small"
            select
            value={filters.category}
            onChange={handleCategoryChange}
            label={categoryLabel}
            fullWidth
            slotProps={{
              inputLabel: {
                sx: {
                  color: "var(--color-text-light)",
                  "&.Mui-focused": { color: "var(--color-text-light)" },
                },
              },
            }}
            sx={{
              minWidth: { md: 200 },
              "& .MuiInputBase-root": { backgroundColor: "transparent" },
              "& .MuiInputBase-root:hover .MuiInputBase-input": {
                color: "var(--color-text-light)",
              },
              "& .MuiInputBase-input": {
                color: "var(--color-text-light)",
                fontSize: "0.875rem",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.35)",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "rgba(255, 255, 255, 0.8)",
                },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "rgba(255, 255, 255, 0.8)",
                },
              "& .MuiSvgIcon-root": { color: "var(--color-text-light)" },
            }}
          >
            <MenuItem value={EGoodsCategory.PANEL}>
              {categoryOptions.find(
                (item) => item.value === EGoodsCategory.PANEL,
              )?.label ?? t(`${categoryTitlePrefix}${EGoodsCategory.PANEL}`)}
            </MenuItem>
            {categoryOptions
              .filter((category) => category.value !== EGoodsCategory.PANEL)
              .map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
          </TextField>
        )}
      </Box>
    </Box>
  );
};
