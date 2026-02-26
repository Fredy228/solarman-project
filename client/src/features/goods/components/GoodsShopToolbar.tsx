"use client";

import { Box, Button, MenuItem, TextField } from "@mui/material";
import { Search } from "lucide-react";
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

export type TGoodsSortMode = "default" | "price_desc" | "price_asc";

export type TGoodsShopToolbarFilters = {
  title_like: string;
  sortMode: TGoodsSortMode;
  category: EGoodsCategory;
};

type GoodsShopToolbarProps = {
  onFiltersChange?: (filters: TGoodsShopToolbarFilters) => void;
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
}) => {
  const t = useTranslations("refine");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<TGoodsShopToolbarFilters>(() => {
    const categoryFromQuery = searchParams.get("category");
    const category = isGoodsCategory(categoryFromQuery)
      ? categoryFromQuery
      : EGoodsCategory.PANEL;

    return {
      title_like: searchParams.get("title_like") ?? "",
      sortMode: getSortModeFromQuery(
        searchParams.get("_sort"),
        searchParams.get("_order"),
      ),
      category,
    };
  }, [searchParams]);

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

    params.set("_sort", "updatedAt");
    params.set("_order", "desc");
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
    updateQuery((params) => {
      params.set("category", value);
    });
  };

  useEffect(() => {
    const categoryFromQuery = searchParams.get("category");
    const sortFromQuery = searchParams.get("_sort");
    const orderFromQuery = searchParams.get("_order");

    const shouldSetDefaultCategory = !isGoodsCategory(categoryFromQuery);
    const shouldSetDefaultSort = !sortFromQuery || !orderFromQuery;

    if (!shouldSetDefaultCategory && !shouldSetDefaultSort) return;

    updateQuery((params) => {
      if (shouldSetDefaultCategory) {
        params.set("category", EGoodsCategory.PANEL);
      }
      if (shouldSetDefaultSort) {
        setSortInQuery(params, "default");
      }
    });
  }, [searchParams, updateQuery]);

  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const isSearchUnchanged = searchValue.trim() === filters.title_like;

  const locale = useLocale();

  const sortModeLabel = t("goods.sort.default");

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

  const categoryOptions = Object.values(EGoodsCategory);

  const toolbarGridTemplateColumns = {
    xs: "1fr",
    md: "2fr 1fr",
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 2 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: 1,
        display: "grid",
        gridTemplateColumns: toolbarGridTemplateColumns,
        gap: 1.5,
        alignItems: "center",
        mb: 3,
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
          slotProps={{
            input: {
              startAdornment: <Search size={16} />,
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={isSearchUnchanged}
          sx={{ minHeight: 40, px: 2.5, whiteSpace: "nowrap" }}
        >
          {findLabel}
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
        }}
      >
        <TextField
          size="small"
          select
          value={filters.sortMode}
          onChange={handleSortModeChange}
          label={priceLabel}
          fullWidth
        >
          <MenuItem value="default">{sortModeLabel}</MenuItem>
          <MenuItem value="price_desc">{priceDescLabel}</MenuItem>
          <MenuItem value="price_asc">{priceAscLabel}</MenuItem>
        </TextField>

        <TextField
          size="small"
          select
          value={filters.category}
          onChange={handleCategoryChange}
          label={categoryLabel}
          fullWidth
        >
          <MenuItem value={EGoodsCategory.PANEL}>
            {t(`${categoryTitlePrefix}${EGoodsCategory.PANEL}`)}
          </MenuItem>
          {categoryOptions
            .filter((category) => category !== EGoodsCategory.PANEL)
            .map((category) => (
              <MenuItem key={category} value={category}>
                {t(`${categoryTitlePrefix}${category}`)}
              </MenuItem>
            ))}
        </TextField>
      </Box>
    </Box>
  );
};
