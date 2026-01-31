import { TextField } from "@mui/material";
import { type FC, type ReactNode } from "react";
import { type ControllerRenderProps } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type Props = {
  id?: string;
  suffix?: string;
  prefix?: string;
  label?: string;
  error?: boolean;
  helperText?: ReactNode;
  fullWidth?: boolean;
} & ControllerRenderProps;

export const NumericFormatSimple: FC<Props> = (props) => {
  const { onChange, ...other } = props;
  return (
    <NumericFormat
      {...other}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator=" "
      decimalSeparator="."
      decimalScale={2}
      allowNegative={false}
      customInput={TextField}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );
};
