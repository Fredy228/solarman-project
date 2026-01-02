import { TextField } from "@mui/material";
import { type FC, type ReactNode } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type Props = {
  id?: string;
  label?: string;
  error?: boolean;
  helperText?: ReactNode;
  fullWidth?: boolean;
} & ControllerRenderProps;

export const NumericFormatFinance: FC<Props> = (props) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      onValueChange={({ value }) => {
        onChange({
          target: {
            name: props.name,
            value,
          },
        });
      }}
      thousandSeparator=" "
      decimalSeparator="."
      decimalScale={2}
      fixedDecimalScale={true}
      allowNegative={false}
      valueIsNumericString={true}
      suffix=" $"
      customInput={TextField}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );
};
