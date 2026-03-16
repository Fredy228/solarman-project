"use client";

import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

interface FileUploadProps {
  value: File | File[] | null;
  onChange: (value: File | File[] | null) => void;
  multiple?: boolean;
  label: string;
  allowedExtensions?: string[]; // e.g. ["pdf","docx"]
  error?: boolean;
  helperText?: string;
  /** Maximum size per file in bytes */
  maxFileSizeBytes?: number;
  /** Maximum number of files (only for multiple mode) */
  maxFiles?: number;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
};

export const FileUpload = ({
  value,
  onChange,
  multiple = false,
  label,
  allowedExtensions,
  error = false,
  helperText,
  maxFileSizeBytes,
  maxFiles,
}: FileUploadProps) => {
  const t = useTranslations("validation");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    setValidationError(null);
    const newFiles = Array.from(event.target.files);

    if (maxFileSizeBytes !== undefined) {
      const oversized = newFiles.find((f) => f.size > maxFileSizeBytes);
      if (oversized) {
        setValidationError(
          t("upload.fileSizeExceeded", {
            filename: oversized.name,
            size: formatBytes(maxFileSizeBytes),
          }),
        );
        event.target.value = "";
        return;
      }
    }

    if (multiple) {
      const currentFiles = Array.isArray(value) ? value : [];
      const combined = [...currentFiles, ...newFiles];

      if (maxFiles !== undefined && combined.length > maxFiles) {
        setValidationError(t("upload.maxFilesExceeded", { count: maxFiles }));
        event.target.value = "";
        return;
      }

      onChange(combined);
    } else {
      onChange(newFiles[0]);
    }

    try {
      event.target.value = "";
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemove = useCallback(
    (fileToRemove: File) => {
      if (Array.isArray(value)) {
        const newFiles = value.filter((file) => file !== fileToRemove);
        onChange(newFiles.length > 0 ? newFiles : null);
      } else {
        onChange(null);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [value, onChange],
  );

  const files = (Array.isArray(value) ? value : value ? [value] : []).filter(
    (f): f is File => f instanceof File,
  );

  const acceptAttr = allowedExtensions
    ? allowedExtensions.map((ext) => `.${ext.replace(/^\./, "")}`).join(",")
    : undefined;

  return (
    <Box>
      <Button
        variant="contained"
        component="label"
        color={error ? "error" : "primary"}
      >
        {label}
        <input
          type="file"
          hidden
          multiple={multiple}
          accept={acceptAttr}
          onChange={handleFileChange}
          ref={inputRef}
        />
      </Button>
      {validationError && (
        <Typography
          color="error"
          variant="caption"
          sx={{ display: "block", mt: 1 }}
        >
          {validationError}
        </Typography>
      )}
      {helperText && (
        <Typography
          color="error"
          variant="caption"
          sx={{ display: "block", mt: 1 }}
        >
          {helperText}
        </Typography>
      )}

      {files.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {files.map((file, index) => {
            const parts = file.name.split(".");
            const ext = parts.length > 1 ? parts.at(-1) : "";
            return (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    backgroundColor: "rgba(0,0,0,0.04)",
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
                  <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                    {file.name}
                  </Typography>
                  <IconButton size="small" onClick={() => handleRemove(file)}>
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
