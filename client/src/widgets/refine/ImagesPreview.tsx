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
import Image from "next/image";
import { memo, useState } from "react";

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
      (images as string[]) || []
    );
    const [open, setOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);

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
              prev.filter((item) => item !== imageToDelete)
            );
            handleClose();
          },
        }
      );
    };

    if (!images) return null;

    return (
      <>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {savedImages.map((image) => {
            return (
              <Box key={image} sx={{ position: "relative" }}>
                <Image
                  src={"/" + image}
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
            {"Підтвердження видалення"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Ви точно хочете видалити це зображення?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Скасувати</Button>
            <Button color="error" onClick={handleDelete} autoFocus>
              Видалити
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

ImagesPreview.displayName = "ImagesPreview";
