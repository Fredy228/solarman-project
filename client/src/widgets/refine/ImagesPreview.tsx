"use client";

import { IPortfolio } from "@/src/features/portfolio";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useDelete } from "@refinedev/core";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { memo, useState } from "react";

const normalizeImageSrc = (src: string): string | null => {
  if (!src || typeof src !== "string") return null;
  const trimmed = src.trim();
  if (!trimmed) return null;
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return new URL(trimmed).toString();
    }
    return trimmed;
  } catch {
    return null;
  }
};

export const ImagesPreview = memo(
  ({
    images,
    resource,
    id,
  }: {
    id?: string;
    images: IPortfolio["images"];
    resource: string;
  }) => {
    const { mutate: deleteImage } = useDelete();
    const [savedImages, setSavedImages] = useState<string[]>(
      (images as string[]) || [],
    );
    const [open, setOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const t = useTranslations("refine");

    const handleClickOpen = (image: string) => {
      setImageToDelete(image);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setImageToDelete(null);
    };

    const handleDelete = () => {
      if (!id || !imageToDelete) return;

      deleteImage(
        {
          resource,
          id,
          values: {
            path: imageToDelete,
          },
        },
        {
          onSuccess: async () => {
            setSavedImages((prev) =>
              prev.filter((item) => item !== imageToDelete),
            );
            handleClose();
          },
        },
      );
    };

    if (!images) return null;

    const normalizedImages = savedImages
      .map((img) => normalizeImageSrc(img))
      .filter((img): img is string => !!img);

    return (
      <>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {normalizedImages.map((image) => {
            return (
              <Box key={image} sx={{ position: "relative" }}>
                <Image
                  src={image}
                  alt="portfolio image"
                  width={150}
                  height={150}
                  style={{ objectFit: "cover" }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                  }}
                  onClick={() => handleClickOpen(image)}
                >
                  <Close />
                </IconButton>
              </Box>
            );
          })}
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t("common.confirm")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("common.sure.deleteImage")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t("buttons.cancel")}</Button>
            <Button color="error" onClick={handleDelete} autoFocus>
              {t("buttons.delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
);

ImagesPreview.displayName = "ImagesPreview";
