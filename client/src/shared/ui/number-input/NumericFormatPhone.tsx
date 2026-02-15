import { TextField } from "@mui/material";
import { type FC, type ReactNode } from "react";
import { type ControllerRenderProps } from "react-hook-form";
import { PatternFormat } from "react-number-format";

type Props = {
  id?: string;
  suffix?: string;
  label?: string;
  error?: boolean;
  helperText?: ReactNode;
  fullWidth?: boolean;
} & ControllerRenderProps;

export const NumericFormatPhone: FC<Props> = (props) => {
  const { onChange, ...other } = props;
  return (
    <PatternFormat
      {...other}
      format="+380 (##) ###-##-##"
      mask="_"
      allowEmptyFormatting
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      customInput={TextField}
      slotProps={{ inputLabel: { shrink: true } }}
    />
  );
};

export default NumericFormatPhone;
