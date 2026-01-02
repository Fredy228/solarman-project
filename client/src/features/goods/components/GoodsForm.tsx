"use client";

import {
  Box,
  Chip,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, type FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

import {
  PanelSpecForm,
  TInvertorSpecs,
  TPanelSpecs,
  type TBatterySpecs,
  type TChargeStationSpecs,
  type TReadyMadeSolutionSpecs,
} from "@/src/features/goods";
import { InvertorSpecForm } from "@/src/features/goods/components/InvertorSpecForm";
import { EGoodsCategory } from "@/src/features/goods/types/goods-category.enum";
import { IGoods, IGoodsForm } from "@/src/features/goods/types/goods.interface";
import { generateSlug } from "@/src/libs/slug";
import { ECurrency } from "@/src/shared/types/currency.enum";
import { ImageUpload } from "@/src/shared/ui/form/ImageUpload";
import { NumericFormatFinance } from "@/src/shared/ui/number-input/NumericFormatFinance";
import { AsyncAutocomplete } from "@/src/widgets/refine/AsyncAutocomplete";
import { ImagesPreview } from "@/src/widgets/refine/ImagesPreview";
import { BatterySpecForm } from "./BatterySpecForm";
import { ChargeStationSpecForm } from "./ChargeStationSpecForm";
import { ReadyMadeSolutionSpecForm } from "./ReadyMadeSolutionSpecForm";

const BlockNoteEditor = dynamic(
  () => import("@/src/shared/ui/editor/BlockNoteEditor"),
  {
    ssr: false,
  }
);

type GoodsFormProps = {
  control: Control<IGoodsForm>;
  errors: FieldErrors<IGoodsForm>;
  registerAction: UseFormRegister<IGoodsForm>;
  watch: UseFormWatch<IGoodsForm>;
  setValueAction: UseFormSetValue<IGoodsForm>;
  isEdit?: boolean;
  goods?: IGoods;
};

export const GoodsForm: FC<GoodsFormProps> = ({
  control,
  errors,
  registerAction,
  watch,
  setValueAction,
  isEdit = false,
  goods,
}) => {
  const t = useTranslations("refine");
  const watchCategory = watch("category");
  const watchTitleUk = watch("titleUk");

  const throttledGenerateTag = useDebouncedCallback((value: string) => {
    if (!value) return;
    const slug = generateSlug(value);
    setValueAction("tag", slug, { shouldValidate: true });
  }, 1000);

  useEffect(() => {
    setValueAction("specs", null);
  }, [watchCategory, setValueAction]);

  useEffect(() => {
    throttledGenerateTag(watchTitleUk);
  }, [watchTitleUk, setValueAction, throttledGenerateTag]);

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      autoComplete="off"
    >
      <Divider textAlign="left">
        <Chip label={t("goods.fields.cover") + " *"} size="small" />
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
      {isEdit && goods?.cover && (
        <Box>
          <Image
            src={"/" + goods.cover}
            alt="cover"
            width={150}
            height={150}
            objectFit={"cover"}
          />
        </Box>
      )}

      <Divider textAlign="left">
        <Chip label={t("goods.fields.images")} size="small" />
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
      {isEdit && goods?.images && (
        <ImagesPreview
          id={goods.id}
          images={goods.images}
          resource={"goods/image"}
        />
      )}

      <Divider textAlign="left">
        <Chip label={t("goods.fields.title") + " *"} size="small" />
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
        label={t("goods.fields.title") + " (uk)"}
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
        label={t("goods.fields.title") + " (ru)"}
        name="titleRu"
      />

      <Divider textAlign="left">
        <Chip label={t("goods.fields.tag") + " *"} size="small" />
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
        label={t("goods.fields.tag") + " (SEO)"}
        name="tag"
      />

      <Divider textAlign="left">
        <Chip label={t("goods.fields.price") + " *"} size="small" />
      </Divider>
      <Controller
        name="price"
        control={control}
        defaultValue={goods?.price?.toString() || ""}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatFinance
            {...field}
            label={t("goods.fields.price")}
            error={!!errors?.price}
            helperText={errors?.price?.message}
            fullWidth
          />
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("goods.fields.discountPrice")} size="small" />
      </Divider>
      <Controller
        name="discountPrice"
        control={control}
        defaultValue={goods?.discountPrice?.toString() || ""}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatFinance
            {...field}
            label={t("goods.fields.discountPrice")}
            error={!!errors?.discountPrice}
            helperText={errors?.discountPrice?.message}
            fullWidth
          />
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("goods.fields.currency") + " *"} size="small" />
      </Divider>
      <Controller
        name="currency"
        control={control}
        defaultValue={goods?.currency || ""}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <TextField
            {...field}
            select
            fullWidth
            label={t("goods.fields.currency")}
            error={!!errors.currency}
            helperText={errors.currency?.message}
            slotProps={{
              inputLabel: { shrink: true },
              select: { displayEmpty: true },
            }}
          >
            <MenuItem key={"null"} value={""}>
              {t(`common.noSelect`)}
            </MenuItem>
            {Object.values(ECurrency).map((currency: ECurrency) => (
              <MenuItem key={currency} value={currency}>
                {t(`goods.currency.${currency}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("goods.fields.category") + " *"} size="small" />
      </Divider>
      <Controller
        name="category"
        control={control}
        defaultValue={goods?.category || ""}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <TextField
            {...field}
            select
            fullWidth
            label={t("goods.fields.category")}
            error={!!errors.category}
            helperText={errors.category?.message}
            slotProps={{
              inputLabel: { shrink: true },
              select: { displayEmpty: true },
            }}
          >
            <MenuItem key={"null"} value={""}>
              {t(`common.noSelect`)}
            </MenuItem>
            {Object.values(EGoodsCategory).map((category: EGoodsCategory) => (
              <MenuItem key={category} value={category}>
                {t(`goods.category.${category}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {watchCategory && (
        <>
          {watchCategory === EGoodsCategory.PANEL && (
            <PanelSpecForm
              control={control}
              registerAction={registerAction}
              t={t}
              errors={errors}
              defaultValues={goods?.specs as TPanelSpecs}
            />
          )}
          {watchCategory === EGoodsCategory.INVERTOR && (
            <InvertorSpecForm
              control={control}
              registerAction={registerAction}
              t={t}
              errors={errors}
              defaultValues={goods?.specs as TInvertorSpecs}
            />
          )}
          {watchCategory === EGoodsCategory.BATTERY && (
            <BatterySpecForm
              control={control}
              registerAction={registerAction}
              t={t}
              errors={errors}
              defaultValues={goods?.specs as TBatterySpecs}
            />
          )}
          {watchCategory === EGoodsCategory.CHARGE_STATION && (
            <ChargeStationSpecForm
              control={control}
              registerAction={registerAction}
              t={t}
              errors={errors}
              defaultValues={goods?.specs as TChargeStationSpecs}
            />
          )}
          {watchCategory === EGoodsCategory.READY_MADE_SOLUTION && (
            <ReadyMadeSolutionSpecForm
              control={control}
              registerAction={registerAction}
              t={t}
              errors={errors}
              defaultValues={goods?.specs as TReadyMadeSolutionSpecs}
            />
          )}
        </>
      )}

      <Divider textAlign="left">
        <Chip label={t("goods.fields.brand")} size="small" />
      </Divider>
      <AsyncAutocomplete
        control={control as unknown as Control}
        errors={errors}
        name="brand"
        label={t("goods.fields.brand")}
        resource="goods-brand"
      />

      <Divider textAlign="left">
        <Chip label={t("goods.fields.description") + " *"} size="small" />
      </Divider>
      <Controller
        name="descriptionUk"
        control={control}
        render={({ field }) => (
          <BlockNoteEditor
            label={t("goods.fields.description") + " (uk)"}
            onChange={field.onChange}
            initialContent={
              goods?.description?.uk && JSON.parse(goods.description.uk)
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
            label={t("goods.fields.description") + " (ru)"}
            onChange={field.onChange}
            initialContent={
              goods?.description?.ru && JSON.parse(goods.description.ru)
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
