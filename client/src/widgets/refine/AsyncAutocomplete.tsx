import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useAutocomplete } from "@refinedev/mui";
import type { FC } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

type Props = {
  control: Control;
  errors: FieldErrors;
  label: string;
  name: string;
  resource: string;
  defaultValues?: string;
};

export const AsyncAutocomplete: FC<Props> = ({
  control,
  errors,
  name,
  label,
  resource,
  defaultValues,
}) => {
  const { autocompleteProps } = useAutocomplete({
    resource,
    defaultValue: defaultValues,
    onSearch: (value) => [
      {
        field: "name",
        operator: "contains",
        value,
      },
    ],
  });

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Autocomplete
            {...autocompleteProps}
            value={
              autocompleteProps.options.find(
                (item) => item.id === field.value
              ) || null
            }
            onChange={(_, newValue) => {
              field.onChange(newValue ? newValue.id : null);
            }}
            getOptionLabel={(item) => item.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                variant="outlined"
                error={!!errors?.[name]}
                helperText={errors?.[name]?.message as string}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {autocompleteProps.loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
        );
      }}
    />
  );
};
