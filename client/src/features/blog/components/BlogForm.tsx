"use client";

import {
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { type FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import { ImageUpload } from "@/src/shared/ui/form/ImageUpload";

import { generateSlug } from "@/src/libs/slug";

import { IBlog, IBlogForm } from "../types/blog.interface";

const BlockNoteEditor = dynamic(
  () => import("@/src/shared/ui/editor/BlockNoteEditor"),

  {
    ssr: false,
  },
);

type BlogFormProps = {
  control: Control<IBlogForm>;
  errors: FieldErrors<IBlogForm>;
  registerAction: UseFormRegister<IBlogForm>;
  watch: UseFormWatch<IBlogForm>;
  setValueAction: UseFormSetValue<IBlogForm>;
  getValuesAction: UseFormGetValues<IBlogForm>;
  isEdit?: boolean;
  blog?: IBlog;
};

export const BlogForm: FC<BlogFormProps> = ({
  control,
  errors,
  registerAction,
  setValueAction,
  getValuesAction,
  isEdit = false,
  blog,
}) => {
  const t = useTranslations("refine");

  const generateTag = () => {
    const title = getValuesAction("titleUk");
    if (!title) return;
    const slug = generateSlug(title);
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
        <Chip label={t("blog.fields.cover")} size="small" />
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
      {isEdit && blog?.cover && (
        <Box>
          <Image
            src={blog.cover}
            alt="cover"
            width={150}
            height={150}
            objectFit={"cover"}
          />
        </Box>
      )}

      <Divider textAlign="left">
        <Chip label={t("blog.fields.title")} size="small" />
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
        label={t("blog.fields.title") + " (uk)"}
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
        label={t("blog.fields.title") + " (ru)"}
        name="titleRu"
      />

      <Divider textAlign="left">
        <Chip label={t("blog.fields.description")} size="small" />
      </Divider>
      <TextField
        {...registerAction("descriptionUk", {
          required: t("common.required_field"),
        })}
        error={!!errors?.descriptionUk}
        helperText={errors?.descriptionUk?.message}
        margin="normal"
        fullWidth
        multiline
        rows={4}
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("blog.fields.description") + " (uk)"}
        name="descriptionUk"
      />
      <TextField
        {...registerAction("descriptionRu", {
          required: t("common.required_field"),
        })}
        error={!!errors?.descriptionRu}
        helperText={errors?.descriptionRu?.message}
        margin="normal"
        fullWidth
        multiline
        rows={4}
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("blog.fields.description") + " (ru)"}
        name="descriptionRu"
      />

      <Divider textAlign="left">
        <Chip label={t("blog.fields.tag")} size="small" />
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
        label={t("blog.fields.tag") + " (SEO)"}
        name="tag"
      />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" onClick={generateTag}>
          {t("buttons.generate")}
        </Button>
      </Box>

      <Divider textAlign="left">
        <Chip label={t("blog.fields.text")} size="small" />
      </Divider>
      <Controller
        name="textUk"
        control={control}
        render={({ field }) => (
          <BlockNoteEditor
            label={t("blog.fields.text") + " (uk)"}
            onChange={field.onChange}
            initialContent={blog?.text?.uk && JSON.parse(blog.text.uk)}
            editable={true}
          />
        )}
      />
      {errors.textUk && (
        <Typography variant="caption" color="error">
          {errors.textUk.message}
        </Typography>
      )}

      <Controller
        name="textRu"
        control={control}
        render={({ field }) => (
          <BlockNoteEditor
            label={t("blog.fields.text") + " (ru)"}
            onChange={field.onChange}
            initialContent={blog?.text?.ru && JSON.parse(blog.text.ru)}
            editable={true}
          />
        )}
      />
      {errors.textRu && (
        <Typography variant="caption" color="error">
          {errors.textRu.message}
        </Typography>
      )}
    </Box>
  );
};
