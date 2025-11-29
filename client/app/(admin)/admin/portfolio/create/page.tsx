"use client";

import { Create } from "@refinedev/mui";
import { Box, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { Controller } from "react-hook-form";

import { ImageUpload } from "@/src/shared/form/ImageUpload";
import { generateSlug } from "@/src/libs/slug";
import { portfolioSchema } from "@/src/validators/portfolio";

interface IPortfolioCreate {
  cover: File | null;
  title: string;
  tag: string;
  description: string;
  images: File[] | null;
  date: string;
}

export default function PortfolioCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IPortfolioCreate>({
    resolver: joiResolver(portfolioSchema),
    defaultValues: {
      cover: null,
      title: "",
      tag: "",
      description: "",
      images: null,
      date: "",
    },
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && value.title) {
        const slug = generateSlug(value.title);
        setValue("tag", slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

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
              error={!!errors.cover}
              helperText={(errors as any).cover?.message}
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
          {...register("date", {
            required: "Це поле є обов'язковим",
          })}
          error={!!(errors as any)?.date}
          helperText={(errors as any)?.date?.message}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Дата завершення"
          name="date"
          type="date"
        />

        <TextField
          {...register("description")}
          error={!!errors.description}
          helperText={(errors as any).description?.message}
          margin="normal"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          label="Опис"
          name="description"
          multiline
          rows={5}
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
              error={!!errors.images}
              helperText={(errors as any).images?.message}
            />
          )}
        />
      </Box>
    </Create>
  );
}
