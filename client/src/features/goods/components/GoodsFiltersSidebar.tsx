"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Drawer,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { type FC, useMemo, useState } from "react";

import { EGoodsCategory } from "@/src/features/goods/types/goods-category.enum";
import {
  TBrandFilter,
  TCountryFilter,
  TFilterValue,
} from "@/src/features/goods/types/goods-filters.type";
import { getCountryName } from "@/src/shared/utils/country-locale";

type GoodsFiltersSidebarProps = {
  fields: Record<
    string,
    TFilterValue[] | TBrandFilter[] | TCountryFilter[]
  > | null;
  category: EGoodsCategory;
  locale: string;
};

type TSelectedFilters = Record<string, string[]>;

const FIELD_ORDER = [
  "type",
  "power",
  "phase",
  "capacity",
  "voltage",
  "material",
  "country",
  "brand",
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
      .map((value: string) => value.trim())
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
    country: "goods.fields.country",
    brand: "goods.fields.brand",
  };

  const key = keyMap[fieldName];
  return key ? t(key) : fieldName;
};

const buildValueLabel = (
  fieldName: string,
  value: TFilterValue | TBrandFilter | TCountryFilter,
  category: EGoodsCategory,
  t: ReturnType<typeof useTranslations>,
): string => {
  if (fieldName === "brand" && typeof value === "object" && "name" in value) {
    return value.name;
  }

  if (
    fieldName === "country" &&
    typeof value === "object" &&
    "label" in value
  ) {
    return (value as TCountryFilter).label;
  }

  const normalizedValue = String(value);

  if (fieldName === "type") {
    const prefix = getTypeTranslationPrefix(category);
    return prefix ? t(`${prefix}.${normalizedValue}`) : normalizedValue;
  }

  if (fieldName === "material") {
    const prefix = getMaterialTranslationPrefix(category);
    return prefix ? t(`${prefix}.${normalizedValue}`) : normalizedValue;
  }

  const unitKeyMap: Record<string, string> = {
    power: "goods.measurements.kilowatts",
    capacity: "goods.measurements.kilowattHour",
    voltage: "goods.measurements.volt",
  };

  const unitKey = unitKeyMap[fieldName];
  if (unitKey) {
    return `${normalizedValue} ${t(unitKey)}`;
  }

  return normalizedValue;
};

const GoodsFiltersSidebar: FC<GoodsFiltersSidebarProps> = ({
  fields,
  category,
  locale,
}) => {
  const t = useTranslations("refine");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const localizedFields = useMemo(() => {
    if (!fields) return null;

    const result: Record<
      string,
      TFilterValue[] | TBrandFilter[] | TCountryFilter[]
    > = {};

    Object.entries(fields).forEach(([fieldName, values]) => {
      if (fieldName === "country") {
        result[fieldName] = (values as TFilterValue[]).map(
          (value): TCountryFilter => ({
            code: String(value),
            label: getCountryName(String(value), locale),
          }),
        );
      } else {
        result[fieldName] = values;
      }
    });

    return result;
  }, [fields, locale]);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<TSelectedFilters>(() =>
    parseSelectedFiltersFromSearchParams(searchParams),
  );

  // Секции с активными фильтрами раскрыты по умолчанию, остальные свёрнуты.
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    const initialSelected = parseSelectedFiltersFromSearchParams(searchParams);
    const expanded: Record<string, boolean> = {};
    Object.keys(initialSelected).forEach((key) => {
      expanded[key] = true;
    });
    return expanded;
  });

  const fieldEntries = localizedFields ? Object.entries(localizedFields) : [];
  const orderedFieldEntries = fieldEntries.sort(
    ([a], [b]) => FIELD_ORDER.indexOf(a) - FIELD_ORDER.indexOf(b),
  );

  const toggleSection = (fieldName: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [fieldName]: !(prev[fieldName] ?? false),
    }));
  };

  const toggleFilterValue = (fieldName: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[fieldName] ?? [];
      const isSelected = currentValues.includes(value);

      if (isSelected) {
        const nextValues = currentValues.filter((item) => item !== value);
        if (nextValues.length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [fieldName]: _, ...rest } = prev;
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

  const resetFilters = () => {
    setSelectedFilters({});

    const nextParams = new URLSearchParams(searchParams.toString());
    FILTER_QUERY_FIELDS.forEach((fieldName) => {
      nextParams.delete(fieldName);
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
        border: "none",
        borderColor: "transparent",
        bgcolor: { xs: "background.paper", lg: "transparent" },
        background: { xs: "none", lg: "var(--bg-section-gradient)" },
        color: "var(--color-text-g2)",
        boxShadow: { xs: "none", lg: 2 },
      }}
    >
      <Typography variant="h6" mb={1.5}>
        {t("filters.title")}
      </Typography>

      {orderedFieldEntries.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t("filters.empty")}
        </Typography>
      )}

      <Stack spacing={1}>
        {orderedFieldEntries.map(([fieldName, values]) => {
          const isExpanded = expandedSections[fieldName] ?? false;

          return (
            <Box
              key={fieldName}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "var(--border-radius-main)",
                overflow: "hidden",
                bgcolor: { xs: "background.paper", lg: "transparent" },
              }}
            >
              <Button
                variant="text"
                fullWidth
                onClick={() => toggleSection(fieldName)}
                endIcon={
                  <ExpandMoreIcon
                    sx={{
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                }
                sx={{
                  minHeight: 36,
                  px: 1.25,
                  py: 0.5,
                  justifyContent: "space-between",
                  textTransform: "none",
                  color: "var(--color-text-g2)",
                  borderRadius: "var(--border-radius-main)",
                  "& .MuiButton-endIcon": {
                    ml: 1,
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {buildFieldLabel(fieldName, t)}
                </Typography>
              </Button>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <FormGroup
                  sx={{
                    px: 1.25,
                    pb: 0.75,
                    pt: 0.25,
                    gap: 0.125,
                  }}
                >
                  {values.map((value) => {
                    const isBrandFilter =
                      fieldName === "brand" &&
                      typeof value === "object" &&
                      "id" in value;
                    const isCountryFilter =
                      fieldName === "country" &&
                      typeof value === "object" &&
                      "code" in value;
                    const valueAsString = isBrandFilter
                      ? (value as TBrandFilter).id
                      : isCountryFilter
                        ? (value as TCountryFilter).code
                        : String(value);

                    return (
                      <FormControlLabel
                        key={`${fieldName}-${valueAsString}`}
                        control={
                          <Checkbox
                            size="small"
                            checked={
                              selectedFilters[fieldName]?.includes(
                                valueAsString,
                              ) ?? false
                            }
                            onChange={() =>
                              toggleFilterValue(fieldName, valueAsString)
                            }
                            sx={{
                              p: 0.5,
                              mr: 0.5,
                            }}
                          />
                        }
                        label={buildValueLabel(fieldName, value, category, t)}
                        sx={{
                          color: "var(--color-text-g2)",
                          m: 0,
                          minHeight: 30,
                          "& .MuiFormControlLabel-label": {
                            fontSize: "0.875rem",
                            lineHeight: 1.2,
                          },
                        }}
                      />
                    );
                  })}
                </FormGroup>
              </Collapse>
            </Box>
          );
        })}

        {orderedFieldEntries.length > 0 && (
          <Stack direction="column" spacing={1} sx={{ mt: 0.75 }}>
            <Button
              variant="contained"
              size="small"
              onClick={applyFilters}
              sx={{ flex: 1 }}
            >
              {t("filters.apply")}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={resetFilters}
              disabled={Object.keys(selectedFilters).length === 0}
              sx={{ flex: 1 }}
            >
              {t("filters.reset")}
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: { xs: "block", lg: "none" },
          width: "100%",
          flexBasis: "100%",
          mb: 2,
        }}
      >
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
          width: 240,
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
