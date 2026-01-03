"use client";

import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { useCallback } from "react";

interface FileUploadProps {
  value: File | File[] | null;
  onChange: (value: File | File[] | null) => void;
  multiple?: boolean;
  label: string;
  allowedExtensions?: string[]; // e.g. ["pdf","docx"]
  error?: boolean;
  helperText?: string;
}

export const FileUpload = ({
  value,
  onChange,
  multiple = false,
  label,
  allowedExtensions,
  error = false,
  helperText,
}: FileUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (multiple) {
        const newFiles = Array.from(event.target.files);
        const currentFiles = Array.isArray(value) ? value : [];
        onChange([...currentFiles, ...newFiles]);
      } else {
        onChange(event.target.files[0]);
      }
      try {
        (event.target as HTMLInputElement).value = "";
      } catch (e) {
        console.error(e);
      }
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
      try {
        const input =
          document.querySelector<HTMLInputElement>("input[type=file]");
        if (input) input.value = "";
      } catch (e) {
        console.error(e);
      }
    },
    [value, onChange]
  );

  const files = (Array.isArray(value) ? value : value ? [value] : []).filter(
    (f) => typeof f !== "string"
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
        />
      </Button>
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
