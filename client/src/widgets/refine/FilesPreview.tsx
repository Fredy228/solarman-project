"use client";

import { PdfInfo } from "@/src/features/goods";
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
  Paper,
  Typography,
} from "@mui/material";
import { useDelete } from "@refinedev/core";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";

export const FilesPreview = memo(
  ({
    instructions,
    resource,
    id,
  }: {
    id?: string;
    instructions: PdfInfo[];
    resource: string;
  }) => {
    const { mutate: deleteFile } = useDelete();
    const [saved, setSaved] = useState<string[]>(
      (instructions || []).map((i) => i.filePath)
    );
    const [open, setOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const t = useTranslations("refine");

    const handleClickOpen = (path: string) => {
      setFileToDelete(path);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setFileToDelete(null);
    };

    const handleDelete = () => {
      if (!id || !fileToDelete) return;

      deleteFile(
        {
          resource,
          id,
          values: {
            path: fileToDelete,
          },
        },
        {
          onSuccess: () => {
            setSaved((prev) => prev.filter((p) => p !== fileToDelete));
            handleClose();
          },
        }
      );
    };

    if (!instructions || instructions.length === 0) return null;

    return (
      <>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {instructions.map((ins) => {
            if (!saved.includes(ins.filePath)) return null;
            const parts = ins.fileName.split(".");
            const ext = parts.length > 1 ? parts.at(-1) : "";
            return (
              <Paper
                key={ins.filePath}
                elevation={2}
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.04)",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2">
                    {ext?.toUpperCase()}
                  </Typography>
                </Paper>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <a href={"/" + ins.filePath} target="_blank" rel="noreferrer">
                    <Typography variant="body2">{ins.fileName}</Typography>
                  </a>
                  <IconButton onClick={() => handleClickOpen(ins.filePath)}>
                    <Close />
                  </IconButton>
                </Box>
              </Paper>
            );
          })}
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{t("common.confirm")}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t("common.sure.deleteFile")}</DialogContentText>
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
  }
);

FilesPreview.displayName = "FilesPreview";
