"use client";

import { Box, Chip, Divider, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { type FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import { NumericFormatPhone } from "@/src/shared/ui/number-input/NumericFormatPhone";
import type { TContacts } from "../types/contacts.type";

type ContactsFormProps = {
  errors: FieldErrors<TContacts>;
  registerAction: UseFormRegister<TContacts>;
  control: Control<TContacts>;
};

export const ContactsForm: FC<ContactsFormProps> = ({
  errors,
  registerAction,
  control,
}) => {
  const t = useTranslations("refine");

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      autoComplete="off"
    >
      <Divider textAlign="left">
        <Chip label={t("contacts.fields.phone")} size="small" />
      </Divider>
      <Controller
        name="phone"
        control={control}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatPhone
            {...field}
            label={t("contacts.fields.phone")}
            error={!!errors?.phone}
            helperText={errors?.phone?.message}
            fullWidth
          />
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("contacts.fields.email")} size="small" />
      </Divider>
      <TextField
        {...registerAction("email", {
          required: t("common.required_field"),
        })}
        error={!!errors?.email}
        helperText={errors?.email?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("contacts.fields.email")}
        name="email"
      />

      <Divider textAlign="left">
        <Chip label={t("contacts.fields.address")} size="small" />
      </Divider>
      <TextField
        {...registerAction("address.uk", {
          required: t("common.required_field"),
        })}
        error={!!errors?.address?.uk}
        helperText={errors?.address?.uk?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("contacts.fields.address") + " (UK)"}
        name="address.uk"
      />
      <TextField
        {...registerAction("address.ru", {
          required: t("common.required_field"),
        })}
        error={!!errors?.address?.ru}
        helperText={errors?.address?.ru?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("contacts.fields.address") + " (RU)"}
        name="address.ru"
      />

      <Divider textAlign="left">
        <Chip label={t("contacts.fields.link_google_maps")} size="small" />
      </Divider>
      <TextField
        {...registerAction("link_google_maps", {
          required: t("common.required_field"),
        })}
        error={!!errors?.link_google_maps}
        helperText={errors?.link_google_maps?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("contacts.fields.link_google_maps")}
        name="link_google_maps"
      />

      <Divider textAlign="left">
        <Chip label={t("contacts.fields.link_facebook")} size="small" />
      </Divider>
      <TextField
        {...registerAction("link_facebook", {
          required: t("common.required_field"),
        })}
        error={!!errors?.link_facebook}
        helperText={errors?.link_facebook?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("contacts.fields.link_facebook")}
        name="link_facebook"
      />

      <Divider textAlign="left">
        <Chip label={t("contacts.fields.link_instagram")} size="small" />
      </Divider>
      <TextField
        {...registerAction("link_instagram", {
          required: t("common.required_field"),
        })}
        error={!!errors?.link_instagram}
        helperText={errors?.link_instagram?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("contacts.fields.link_instagram")}
        name="link_instagram"
      />

      <Divider textAlign="left">
        <Chip label={t("contacts.fields.link_instagram")} size="small" />
      </Divider>
      <TextField
        {...registerAction("link_telegram", {
          required: t("common.required_field"),
        })}
        error={!!errors?.link_telegram}
        helperText={errors?.link_telegram?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("contacts.fields.link_telegram")}
        name="link_telegram"
      />

      <Divider textAlign="left">
        <Chip label={t("contacts.fields.link_youtube")} size="small" />
      </Divider>
      <TextField
        {...registerAction("link_youtube", {
          required: t("common.required_field"),
        })}
        error={!!errors?.link_youtube}
        helperText={errors?.link_youtube?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("contacts.fields.link_youtube")}
        name="link_youtube"
      />
    </Box>
  );
};
