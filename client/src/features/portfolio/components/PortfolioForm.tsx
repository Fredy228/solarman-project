"use client";

import { Box, TextField } from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useEffect } from "react";
import Image from "next/image";

import { ImageUpload } from "@/src/shared/form/ImageUpload";
import { generateSlug } from "@/src/libs/slug";
import { ImagesPreview } from "@/src/widgets/refine/ImagesPreview";
import { IPortfolio } from "@/src/features/portfolio";

interface IPortfolioForm {
  control: Control<any>;
  errors: FieldErrors<any>;
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  isEdit?: boolean;
  portfolio?: IPortfolio;
}

export const PortfolioForm = ({
  control,
  errors,
  register,
  watch,
  setValue,
  isEdit = false,
  portfolio,
}: IPortfolioForm) => {
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
            label={
              isEdit
                ? "Оновити головну фотографію"
                : "Завантажити головну фотографію"
            }
            error={!!errors.cover}
            helperText={(errors as any).cover?.message}
          />
        )}
      />
      {isEdit && portfolio?.cover && typeof portfolio.cover === "string" && (
        <Box>
          <Image
            src={"/" + portfolio.cover}
            alt="cover"
            width={150}
            height={150}
            objectFit={"cover"}
          />
        </Box>
      )}

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
      {isEdit && portfolio?.images && (
        <ImagesPreview
          id={portfolio.id}
          images={portfolio.images}
          resource={"portfolio/image"}
        />
      )}
    </Box>
  );
};
