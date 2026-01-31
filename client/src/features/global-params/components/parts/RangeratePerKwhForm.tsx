import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { Controller, useFieldArray, useWatch } from "react-hook-form";

import { NumericFormatSimple } from "@/src/shared/ui/number-input/NumericFormatSimple";
import type { CalcFormProps } from "../../types/calc-part-props-form.type";
import type { TRangeRatePerKWhForm } from "../../types/calculator-profit.type";
import { EStationType } from "../../types/calculator-profit.type";

type RangeRatePerKwhListProps = CalcFormProps & {
  stationType: EStationType;
};

const getSortValue = (value?: string | number) => {
  if (value === undefined || value === null || value === "") {
    return Number.POSITIVE_INFINITY;
  }

  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
};

const RangeRatePerKwhItemRow = ({
  stationType,
  index,
  control,
  errors,
  t,
  onBlurSort,
  onDelete,
}: RangeRatePerKwhListProps & {
  index: number;
  onBlurSort: () => void;
  onDelete: () => void;
}) => {
  const breakPointError =
    errors?.range_rate_per_kwh?.[stationType]?.[index]?.breakPoint;
  const stepError = errors?.range_rate_per_kwh?.[stationType]?.[index]?.rate;

  return (
    <Stack direction="row" gap={3} alignItems="flex-start">
      <Typography sx={{ minWidth: 24, pt: 1 }}>{index + 1}.</Typography>
      <Box sx={{ flex: 1 }}>
        <Controller
          name={
            `range_rate_per_kwh.${stationType}.${index}.breakPoint` as const
          }
          control={control}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              onBlur={() => {
                field.onBlur();
                setTimeout(onBlurSort, 0);
              }}
              suffix={` ${t("goods.measurements.kilowatts")}`}
              label={t("calculator-profit.fields.break_range_power")}
              error={!!breakPointError}
              helperText={breakPointError?.message}
              fullWidth
            />
          )}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Controller
          name={`range_rate_per_kwh.${stationType}.${index}.rate` as const}
          control={control}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              onBlur={() => {
                field.onBlur();
                setTimeout(onBlurSort, 0);
              }}
              label={t("calculator-profit.fields.rate_per_kWh")}
              error={!!stepError}
              helperText={stepError?.message}
              fullWidth
            />
          )}
        />
      </Box>
      <Box sx={{ pt: 1 }}>
        <IconButton
          size="small"
          color="error"
          onClick={onDelete}
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Stack>
  );
};

const RangeRatePerKwhList = ({
  stationType,
  control,
  errors,
  registerAction,
  t,
}: RangeRatePerKwhListProps) => {
  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: `range_rate_per_kwh.${stationType}` as const,
  });

  const values = useWatch({
    control,
    name: `range_rate_per_kwh.${stationType}` as const,
  }) as TRangeRatePerKWhForm[] | undefined;

  const handleSort = () => {
    const source = values ?? (fields as TRangeRatePerKWhForm[]);
    if (!source || source.length === 0) {
      return;
    }

    const sorted = source
      .map((item, index) => ({
        item,
        index,
        sortValue: getSortValue(item.breakPoint),
      }))
      .sort((a, b) =>
        a.sortValue === b.sortValue
          ? a.index - b.index
          : a.sortValue - b.sortValue,
      )
      .map((entry, index) => ({
        ...entry.item,
        breakPoint: index === 0 ? "0" : entry.item.breakPoint,
      }));

    // Check if order actually changed before replacing
    const orderChanged = sorted.some(
      (item, index) =>
        item.breakPoint !== source[index].breakPoint ||
        item.rate !== source[index].rate,
    );

    if (orderChanged) {
      replace(sorted);
    }
  };

  const handleAdd = () => {
    append({
      breakPoint: "",
      rate: "",
    });
  };

  const handleDelete = (index: number) => {
    remove(index);
  };

  return (
    <Stack gap={2}>
      {fields.map((field, index) => (
        <RangeRatePerKwhItemRow
          key={field.id}
          stationType={stationType}
          index={index}
          control={control}
          errors={errors}
          registerAction={registerAction}
          t={t}
          onBlurSort={handleSort}
          onDelete={() => handleDelete(index)}
        />
      ))}
      <Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="small"
        >
          {t("buttons.add")}
        </Button>
      </Box>
    </Stack>
  );
};

export default function RangeRatePerKwhForm({
  errors,
  control,
  t,
  registerAction,
}: CalcFormProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography>{t("calculator-profit.types.NETWORK")}</Typography>
      <RangeRatePerKwhList
        stationType={EStationType.NETWORK}
        control={control}
        errors={errors}
        registerAction={registerAction}
        t={t}
      />

      <Typography>{t("calculator-profit.types.HYBRID")}</Typography>
      <RangeRatePerKwhList
        stationType={EStationType.HYBRID}
        control={control}
        errors={errors}
        registerAction={registerAction}
        t={t}
      />
    </Box>
  );
}
