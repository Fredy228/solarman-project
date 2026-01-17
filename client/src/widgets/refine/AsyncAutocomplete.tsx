import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useAutocomplete } from "@refinedev/mui";
import type { FC } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

type Option = {
  id: string | number;
  name: string;
};

type Props = {
  control: Control;
  errors: FieldErrors;
  label: string;
  name: string;
  resource: string;
  defaultValues?: Option["id"] | Array<Option["id"]>;
  multiple?: boolean;
};

export const AsyncAutocomplete: FC<Props> = ({
  control,
  errors,
  name,
  label,
  resource,
  defaultValues,
  multiple = false,
}) => {
  const { autocompleteProps } = useAutocomplete<Option>({
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
        const selectedMultipleValues = multiple
          ? (Array.isArray(field.value) ? field.value : [])
              .map((id) =>
                autocompleteProps.options.find((item) => item.id === id),
              )
              .filter((item): item is Option => Boolean(item))
          : [];

        return (
          <Autocomplete
            {...autocompleteProps}
            multiple={multiple}
            value={
              multiple
                ? selectedMultipleValues.filter(Boolean)
                : autocompleteProps.options.find(
                    (item) => item.id === field.value,
                  ) || null
            }
            onChange={(_, newValue) => {
              if (multiple) {
                field.onChange(
                  Array.isArray(newValue)
                    ? newValue.map((item) => item.id)
                    : [],
                );
                return;
              }

              const singleValue = Array.isArray(newValue) ? null : newValue;
              field.onChange(singleValue ? singleValue.id : "");
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
