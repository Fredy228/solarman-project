import { EStationType } from "@/src/features/global-params";
import { NumericFormatSimple } from "@/src/shared/ui/number-input/NumericFormatSimple";
import { Box, MenuItem, Paper, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  Controller,
  type Control,
  type UseFormRegister,
} from "react-hook-form";
import type { TCalculatorForm } from "../types/calculator-form.type";

type Props = {
  registerAction: UseFormRegister<TCalculatorForm>;
  control: Control<TCalculatorForm>;
};

export default function CalculatorSettings({ control }: Props) {
  const t = useTranslations("common");

  return (
    <Paper
      elevation={2}
      component={"form"}
      className="flex flex-col gap-6 p-5 rounded-(--border-radius-main)! w-full"
      sx={{
        background: "var(--bg-section-gradient)",
      }}
    >
      <Controller
        name="stationType"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            onChange={(e) => {
              const value = e.target ? e.target.value : e;
              field.onChange(value);
            }}
            select
            fullWidth
            size="small"
            label={t("calculator.fields.stationType")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          >
            <MenuItem value={EStationType.NETWORK}>
              {t("stationTypes.NETWORK")}
            </MenuItem>
            <MenuItem value={EStationType.HYBRID}>
              {t("stationTypes.HYBRID")}
            </MenuItem>
          </TextField>
        )}
      />

      <Controller
        name="tariff"
        control={control}
        render={({ field }) => (
          <Box>
            <NumericFormatSimple
              {...field}
              label={t("calculator.fields.tariff")}
              suffix={` ${t("currency.UAH")}`}
              fullWidth
              size="small"
            />
          </Box>
        )}
      />

      <Controller
        name="operatingTime"
        control={control}
        render={({ field }) => (
          <Box>
            <NumericFormatSimple
              {...field}
              label={t("calculator.fields.operatingTime")}
              suffix={` ${t("measurements.years")}`}
              fullWidth
              size="small"
            />
          </Box>
        )}
      />
    </Paper>
  );
}
