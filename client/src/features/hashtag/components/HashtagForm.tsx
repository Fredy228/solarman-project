"use client";

import { Box, Button, Chip, Divider, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { type FC } from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";

import { generateSlug } from "@/src/libs/slug";
import { IHashtagForm } from "../types/hashtag.interface";

type HashtagFormProps = {
  errors: FieldErrors<IHashtagForm>;
  registerAction: UseFormRegister<IHashtagForm>;
  getValuesAction: UseFormGetValues<IHashtagForm>;
  setValueAction: UseFormSetValue<IHashtagForm>;
};

export const HashtagForm: FC<HashtagFormProps> = ({
  errors,
  registerAction,
  getValuesAction,
  setValueAction,
}) => {
  const t = useTranslations("refine");

  const generateTag = () => {
    const name = getValuesAction("nameUk");
    if (!name) return;
    const slug = generateSlug(name);
    if (!slug) return;
    setValueAction("tag", slug, { shouldValidate: true });
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      autoComplete="off"
    >
      <Divider textAlign="left">
        <Chip label={t("goods-brand.fields.name")} size="small" />
      </Divider>
      <TextField
        {...registerAction("nameUk", {
          required: t("common.required_field"),
        })}
        error={!!errors?.nameUk}
        helperText={errors?.nameUk?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("goods-brand.fields.name") + " (UK)"}
        name="nameUk"
      />
      <TextField
        {...registerAction("nameRu", {
          required: t("common.required_field"),
        })}
        error={!!errors?.nameRu}
        helperText={errors?.nameRu?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("goods-brand.fields.name") + " (RU)"}
        name="nameRu"
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
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" onClick={generateTag}>
          {t("buttons.generate")}
        </Button>
      </Box>
    </Box>
  );
};
