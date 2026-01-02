"use client";

import {
  Box,
  Chip,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
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
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { ImageUpload } from "@/src/shared/ui/form/ImageUpload";

import { generateSlug } from "@/src/libs/slug";

import { ImagesPreview } from "@/src/widgets/refine/ImagesPreview";

import {
  EPortfolioType,
  IPortfolio,
  IPortfolioForm,
} from "@/src/features/portfolio";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const BlockNoteEditor = dynamic(
  () => import("@/src/shared/ui/editor/BlockNoteEditor"),

  {
    ssr: false,
  },
);

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
  const t = useTranslations("refine");

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "titleUk" && value.titleUk) {
        const slug = generateSlug(value.titleUk);
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
      <Divider textAlign="left">
        <Chip label={t("portfolio.fields.cover")} size="small" />
      </Divider>
      <Controller
        name="cover"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <ImageUpload
            value={field.value}
            onChange={field.onChange}
            label={isEdit ? t("common.update") : t("common.upload")}
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

      <Divider textAlign="left">
        <Chip label={t("portfolio.fields.images")} size="small" />
      </Divider>
      <Controller
        name="images"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <ImageUpload
            value={field.value}
            onChange={field.onChange}
            label={t("common.upload_more")}
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

      <Divider textAlign="left">
        <Chip label={t("portfolio.fields.title")} size="small" />
      </Divider>
      <TextField
        {...registerAction("titleUk", {
          required: t("common.required_field"),
        })}
        error={!!errors?.titleUk}
        helperText={errors?.titleUk?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("portfolio.fields.title") + " (uk)"}
        name="titleUk"
      />
      <TextField
        {...registerAction("titleRu", {
          required: t("common.required_field"),
        })}
        error={!!errors?.titleRu}
        helperText={errors?.titleRu?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("portfolio.fields.title") + " (ru)"}
        name="titleRu"
      />

      <Divider textAlign="left">
        <Chip label={t("portfolio.fields.tag")} size="small" />
      </Divider>
      <TextField
        {...registerAction("tag", {
          required: t("common.required_field"),
        })}
        error={!!errors?.tag}
        helperText={errors?.tag?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("portfolio.fields.tag") + " (SEO)"}
        name="tag"
      />
      <Divider textAlign="left">
        <Chip label={t("portfolio.fields.type")} size="small" />
      </Divider>
      <Controller
        name="type"
        control={control}
        defaultValue={portfolio?.type || EPortfolioType.HOME}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>{t("portfolio.fields.type")}</InputLabel>
            <Select {...field} label={t("portfolio.fields.type")}>
              {Object.values(EPortfolioType).map((type: EPortfolioType) => (
                <MenuItem key={type} value={type}>
                  {t(`portfolio.type.${type}`)}
                </MenuItem>
              ))}
            </Select>
            {errors.type && (
              <FormHelperText>{errors.type.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("portfolio.fields.date")} size="small" />
      </Divider>
      <Controller
        name="date"
        control={control}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <DatePicker
            {...field}
            label={t("portfolio.fields.date")}
            format="DD.MM.YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                error: !!errors?.date,
                helperText: errors?.date?.message,
              },
            }}
          />
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("portfolio.fields.description")} size="small" />
      </Divider>
      <Controller
        name="descriptionUk"
        control={control}
        render={({ field }) => (
          <BlockNoteEditor
            label={t("portfolio.fields.description") + " (uk)"}
            onChange={field.onChange}
            initialContent={
              portfolio?.description?.uk && JSON.parse(portfolio.description.uk)
            }
            editable={true}
          />
        )}
      />
      {errors.descriptionUk && (
        <Typography variant="caption" color="error">
          {errors.descriptionUk.message}
        </Typography>
      )}

      <Controller
        name="descriptionRu"
        control={control}
        render={({ field }) => (
          <BlockNoteEditor
            label={t("portfolio.fields.description") + " (ru)"}
            onChange={field.onChange}
            initialContent={
              portfolio?.description?.ru && JSON.parse(portfolio.description.ru)
            }
            editable={true}
          />
        )}
      />
      {errors.descriptionRu && (
        <Typography variant="caption" color="error">
          {errors.descriptionRu.message}
        </Typography>
      )}
    </Box>
  );
};
