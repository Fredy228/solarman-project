"use client";

import { Create } from "@refinedev/mui";
import { Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import { ImageUpload } from "@/src/shared/form/ImageUpload";
import { useEffect } from "react";
import { generateSlug } from "@/src/libs/slug";

export default function PortfolioCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const titleValue = watch("title");

  useEffect(() => {
    if (titleValue) {
      const slug = generateSlug(titleValue);
      setValue("tag", slug, { shouldValidate: true });
    }
  }, [titleValue, setValue]);

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        autoComplete="off"
      >
        <Controller
          name="cover"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              label="Завантажити головну фотографію"
            />
          )}
        />

        <TextField
          {...register("title", {
            required: "Це поле є обов'язковим",
          })}
          error={!!(errors as any)?.title}
          helperText={(errors as any)?.title?.message}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Назва"
          name="title"
        />

        <TextField
          {...register("tag", {
            required: "Це поле є обов'язковим",
          })}
          error={!!(errors as any)?.tag}
          helperText={(errors as any)?.tag?.message}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Тег (для SEO)"
          name="tag"
        />

        <TextField
          {...register("description")}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Опис"
          name="description"
          multiline
          rows={4}
        />

        <Controller
          name="images"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
              label="Завантажити додаткові фотографії"
              multiple
            />
          )}
        />
      </Box>
    </Create>
  );
}
