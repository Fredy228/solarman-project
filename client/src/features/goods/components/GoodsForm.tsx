"use client";

import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import countries from "i18n-iso-countries";
import ruLocale from "i18n-iso-countries/langs/ru.json";
import ukLocale from "i18n-iso-countries/langs/uk.json";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, type FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import {
  EBadgeType,
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
import { FileUpload } from "@/src/shared/ui/form/FileUpload";
import { ImageUpload } from "@/src/shared/ui/form/ImageUpload";
import { NumericFormatFinance } from "@/src/shared/ui/number-input/NumericFormatFinance";
import { AsyncAutocomplete } from "@/src/widgets/refine/AsyncAutocomplete";
import { FilesPreview } from "@/src/widgets/refine/FilesPreview";
import { ImagesPreview } from "@/src/widgets/refine/ImagesPreview";
import { BatterySpecForm } from "./BatterySpecForm";
import { ChargeStationSpecForm } from "./ChargeStationSpecForm";
import { ReadyMadeSolutionSpecForm } from "./ReadyMadeSolutionSpecForm";

const BlockNoteEditor = dynamic(
  () => import("@/src/shared/ui/editor/BlockNoteEditor"),
  {
    ssr: false,
  },
);

type GoodsFormProps = {
  control: Control<IGoodsForm>;
  errors: FieldErrors<IGoodsForm>;
  registerAction: UseFormRegister<IGoodsForm>;
  watch: UseFormWatch<IGoodsForm>;
  setValueAction: UseFormSetValue<IGoodsForm>;
  getValuesAction: UseFormGetValues<IGoodsForm>;
  isEdit?: boolean;
  goods?: IGoods;
};

export const GoodsForm: FC<GoodsFormProps> = ({
  control,
  errors,
  registerAction,
  watch,
  setValueAction,
  getValuesAction,
  isEdit = false,
  goods,
}) => {
  const t = useTranslations("refine");
  const locale = useLocale();
  const watchCategory = watch("category");

  useEffect(() => {
    try {
      countries.registerLocale(ukLocale);
      countries.registerLocale(ruLocale);
    } catch (e) {
      console.error(e);
    }
  }, []);

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
            maxFileSizeBytes={10000000}
          />
        )}
      />
      {isEdit && goods?.cover && (
        <Box>
          <Image
            src={goods.cover}
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
            maxFileSizeBytes={10000000}
            maxFiles={10}
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
        <Chip label={t("goods.fields.instructions")} size="small" />
      </Divider>
      <Controller
        name="instructions"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <FileUpload
            value={field.value}
            onChange={field.onChange}
            label={t("common.upload_more")}
            multiple
            allowedExtensions={["pdf", "x-pdf", "x-bzpdf", "x-gzpdf"]}
            error={!!errors.instructions}
            helperText={errors.instructions?.message}
            maxFileSizeBytes={20000000}
            maxFiles={5}
          />
        )}
      />
      {isEdit && goods?.instructions && (
        <FilesPreview
          id={goods.id}
          instructions={goods.instructions}
          resource={"goods/instructions"}
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
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" onClick={generateTag}>
          {t("buttons.generate")}
        </Button>
      </Box>

      <Divider textAlign="left">
        <Chip label={t("goods.fields.price") + " *"} size="small" />
      </Divider>
      <Controller
        name="price"
        control={control}
        defaultValue={goods?.price ? (goods.price / 100).toFixed(2) : ""}
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
        defaultValue={
          goods?.discountPrice ? (goods.discountPrice / 100).toFixed(2) : ""
        }
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
        <Chip label={t("goods.fields.badge")} size="small" />
      </Divider>
      <Controller
        name="badge"
        control={control}
        defaultValue={goods?.badge || ""}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <TextField
            {...field}
            select
            fullWidth
            label={t("goods.fields.badge")}
            error={!!errors.badge}
            helperText={errors.badge?.message}
            slotProps={{
              inputLabel: { shrink: true },
              select: { displayEmpty: true },
            }}
          >
            <MenuItem key={"null"} value={""}>
              {t(`common.noSelect`)}
            </MenuItem>
            {Object.values(EBadgeType).map((badge: EBadgeType) => (
              <MenuItem key={badge} value={badge}>
                {t(`goods.badge.${badge}`)}
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
            onChange={(e) => {
              const value = e.target ? e.target.value : e;
              field.onChange(value);
              setValueAction("specs", null);
            }}
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
        <Chip label={t("goods.fields.country")} size="small" />
      </Divider>
      <Controller
        name="country"
        control={control}
        defaultValue={goods?.country || ""}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => {
          const names = countries.getNames(locale === "uk" ? "uk" : "ru");
          const options = Object.entries(names || {})
            .map(([code, name]) => ({
              code: code.toLowerCase(),
              label: name as string,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

          const selected =
            options.find((o) => o.code === (field.value || "")) || null;

          return (
            <Autocomplete
              options={options}
              getOptionLabel={(opt) => opt.label}
              value={selected}
              onChange={(_, newVal) =>
                field.onChange(newVal ? newVal.code : "")
              }
              isOptionEqualToValue={(option, value) =>
                option.code === value.code
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("goods.fields.country")}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
          );
        }}
      />

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
