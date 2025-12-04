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
import { type FC, useEffect } from "react";
import Image from "next/image";

import { ImageUpload } from "@/src/shared/form/ImageUpload";
import { generateSlug } from "@/src/libs/slug";
import { ImagesPreview } from "@/src/widgets/refine/ImagesPreview";
import { IPortfolio, IPortfolioForm } from "@/src/features/portfolio";
import { HtmlFromText } from "@/src/shared/html-from-text/HtmlFromText";
import { HtmlFromTextHelper } from "@/src/shared/html-from-text/HtmlFronTextHelper";

type PortfolioFormProps = {
  control: Control<IPortfolioForm>;
  errors: FieldErrors<IPortfolioForm>;
  registerAction: UseFormRegister<IPortfolioForm>;
  watch: UseFormWatch<IPortfolioForm>;
  setValueAction: UseFormSetValue<IPortfolioForm>;
  isEdit?: boolean;
  portfolio?: IPortfolio;
};

export const PortfolioForm: FC<PortfolioFormProps> = ({
  control,
  errors,
  registerAction,
  watch,
  setValueAction,
  isEdit = false,
  portfolio,
}) => {
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && value.title) {
        const slug = generateSlug(value.title);
        setValueAction("tag", slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValueAction]);

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
            helperText={errors?.cover?.message}
          />
        )}
      />
      {isEdit && portfolio?.cover && (
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
        {...registerAction("title", {
          required: "Це поле є обов'язковим",
        })}
        error={!!errors?.title}
        helperText={errors?.title?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label="Назва"
        name="title"
      />

      <TextField
        {...registerAction("tag", {
          required: "Це поле є обов'язковим",
        })}
        error={!!errors?.tag}
        helperText={errors?.tag?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label="Тег (для SEO)"
        name="tag"
      />

      <TextField
        {...registerAction("date", {
          required: "Це поле є обов'язковим",
          valueAsDate: true,
        })}
        error={!!errors?.date}
        helperText={errors?.date?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label="Дата завершення"
        name="date"
        type="date"
      />

      <HtmlFromTextHelper />
      <TextField
        {...registerAction("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label="Опис"
        name="description"
        multiline
        rows={5}
        sx={{
          "& .MuiInputBase-inputMultiline": {
            resize: "vertical",
          },
        }}
      />
      {watch("description") && <HtmlFromText text={watch("description")} />}

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
            helperText={errors.images?.message}
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
