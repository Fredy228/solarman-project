"use client";

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FC, useMemo, useState } from "react";

import { EGoodsCategory } from "@/src/features/goods/types/goods-category.enum";
import { TFilterValue } from "@/src/features/goods/types/goods-filters.type";

type GoodsFiltersSidebarProps = {
  fields: Record<string, TFilterValue[]> | null;
  category: EGoodsCategory;
};

type TSelectedFilters = Record<string, string[]>;

const FIELD_ORDER = [
  "type",
  "power",
  "phase",
  "capacity",
  "voltage",
  "material",
];

const FILTER_QUERY_FIELDS = new Set(FIELD_ORDER);

const getTypeTranslationPrefix = (category: EGoodsCategory): string | null => {
  if (category === EGoodsCategory.PANEL) return "goods.specs.panelType";
  if (category === EGoodsCategory.INVERTOR) return "goods.specs.invertorType";
  if (category === EGoodsCategory.BATTERY) return "goods.specs.batteryType";
  if (category === EGoodsCategory.FASTENER) return "goods.specs.fastenerType";
  return null;
};

const getMaterialTranslationPrefix = (
  category: EGoodsCategory,
): string | null => {
  if (category === EGoodsCategory.FASTENER)
    return "goods.specs.fastenerMaterial";
  return null;
};

const parseSelectedFiltersFromSearchParams = (
  searchParams: ReadonlyURLSearchParams,
): TSelectedFilters => {
  const selected: TSelectedFilters = {};

  FILTER_QUERY_FIELDS.forEach((fieldName) => {
    const values = searchParams
      .getAll(fieldName)
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    if (values.length > 0) {
      selected[fieldName] = values;
    }
  });

  return selected;
};

const buildFieldLabel = (
  fieldName: string,
  t: ReturnType<typeof useTranslations>,
): string => {
  const keyMap: Record<string, string> = {
    type: "goods.fields.specs.type",
    power: "goods.fields.specs.power",
    phase: "goods.fields.specs.phase",
    capacity: "goods.fields.specs.capacity",
    voltage: "goods.fields.specs.voltage",
    material: "goods.fields.specs.material",
  };

  const key = keyMap[fieldName];
  return key ? t(key) : fieldName;
};

const buildValueLabel = (
  fieldName: string,
  value: TFilterValue,
  category: EGoodsCategory,
  t: ReturnType<typeof useTranslations>,
): string => {
  const normalizedValue = String(value);

  if (fieldName === "type") {
    const prefix = getTypeTranslationPrefix(category);
    return prefix ? t(`${prefix}.${normalizedValue}`) : normalizedValue;
  }

  if (fieldName === "material") {
    const prefix = getMaterialTranslationPrefix(category);
    return prefix ? t(`${prefix}.${normalizedValue}`) : normalizedValue;
  }

  return normalizedValue;
};

const GoodsFiltersSidebar: FC<GoodsFiltersSidebarProps> = ({
  fields,
  category,
}) => {
  const t = useTranslations("refine");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<TSelectedFilters>(() =>
    parseSelectedFiltersFromSearchParams(searchParams),
  );

  const fieldEntries = fields ? Object.entries(fields) : [];
  const orderedFieldEntries = fieldEntries.sort(
    ([a], [b]) => FIELD_ORDER.indexOf(a) - FIELD_ORDER.indexOf(b),
  );

  const isApplyDisabled = useMemo(() => {
    const currentSelected = parseSelectedFiltersFromSearchParams(searchParams);
    const currentKeys = Object.keys(currentSelected);
    const draftKeys = Object.keys(selectedFilters);

    if (currentKeys.length !== draftKeys.length) return false;

    return draftKeys.every((key) => {
      const currentValues = [...(currentSelected[key] ?? [])].sort();
      const draftValues = [...(selectedFilters[key] ?? [])].sort();

      if (currentValues.length !== draftValues.length) return false;

      return draftValues.every(
        (value, index) => value === currentValues[index],
      );
    });
  }, [searchParams, selectedFilters]);

  const toggleFilterValue = (fieldName: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[fieldName] ?? [];
      const isSelected = currentValues.includes(value);

      if (isSelected) {
        const nextValues = currentValues.filter((item) => item !== value);
        if (nextValues.length === 0) {
          const { [fieldName]: _removed, ...rest } = prev;
          return rest;
        }

        return {
          ...prev,
          [fieldName]: nextValues,
        };
      }

      return {
        ...prev,
        [fieldName]: [...currentValues, value],
      };
    });
  };

  const applyFilters = () => {
    const nextParams = new URLSearchParams(searchParams.toString());

    FILTER_QUERY_FIELDS.forEach((fieldName) => {
      nextParams.delete(fieldName);
    });

    Object.entries(selectedFilters).forEach(([fieldName, values]) => {
      values.forEach((value) => {
        nextParams.append(fieldName, value);
      });
    });

    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });

    setIsMobileOpen(false);
  };

  const panelContent = (
    <Box
      sx={{
        p: 2,
        borderRadius: { xs: 0, lg: 3 },
        border: { xs: "none", lg: "1px solid" },
        borderColor: "divider",
        bgcolor: "background.paper",
        color: "var(--color-text-g2)",
        boxShadow: { xs: "none", lg: 1 },
      }}
    >
      <Typography variant="h6" mb={2}>
        {t("filters.title")}
      </Typography>

      {orderedFieldEntries.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t("filters.empty")}
        </Typography>
      )}

      <Stack spacing={2.5}>
        {orderedFieldEntries.map(([fieldName, values]) => (
          <Box key={fieldName}>
            <Typography variant="subtitle2" mb={1}>
              {buildFieldLabel(fieldName, t)}
            </Typography>

            <FormGroup>
              {values.map((value) => {
                const valueAsString = String(value);

                return (
                  <FormControlLabel
                    key={`${fieldName}-${valueAsString}`}
                    control={
                      <Checkbox
                        size="small"
                        checked={
                          selectedFilters[fieldName]?.includes(valueAsString) ??
                          false
                        }
                        onChange={() =>
                          toggleFilterValue(fieldName, valueAsString)
                        }
                      />
                    }
                    label={buildValueLabel(fieldName, value, category, t)}
                    sx={{ color: "var(--color-text-g2)" }}
                  />
                );
              })}
            </FormGroup>
          </Box>
        ))}

        {orderedFieldEntries.length > 0 && (
          <Button
            variant="contained"
            size="small"
            onClick={applyFilters}
            disabled={isApplyDisabled}
          >
            {t("filters.apply")}
          </Button>
        )}
      </Stack>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: { xs: "flex", lg: "none" }, mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsMobileOpen(true)}
        >
          {t("filters.show")}
        </Button>
      </Box>

      <Drawer
        anchor="left"
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        sx={{ display: { xs: "block", lg: "none" } }}
      >
        <Box sx={{ width: 320 }}>{panelContent}</Box>
      </Drawer>

      <Box
        sx={{
          width: 300,
          flexShrink: 0,
          display: { xs: "none", lg: "block" },
          position: "sticky",
          top: 20,
        }}
      >
        {panelContent}
      </Box>
    </>
  );
};

export default GoodsFiltersSidebar;
