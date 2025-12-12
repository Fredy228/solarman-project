"use client";

import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useCallback } from "react";
import Image from "next/image";

interface ImageUploadProps {
  value: File | File[] | null;
  onChange: (value: File | File[] | null) => void;
  multiple?: boolean;
  label: string;
  error?: boolean;
  helperText?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  multiple = false,
  label,
  error = false,
  helperText,
}: ImageUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (multiple) {
        const newFiles = Array.from(event.target.files);
        const currentFiles = Array.isArray(value) ? value : [];
        onChange([...currentFiles, ...newFiles]);
      } else {
        onChange(event.target.files[0]);
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
    },
    [value, onChange],
  );

  const files = (Array.isArray(value) ? value : value ? [value] : []).filter(
    (f) => typeof f !== "string",
  );

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
          accept="image/*"
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
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            marginTop: 2,
          }}
        >
          {files.map((file, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                position: "relative",
                width: 120,
                height: 120,
                overflow: "hidden",
                borderRadius: "8px",
              }}
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`preview ${index}`}
                width={120}
                height={120}
                loading="eager"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemove(file)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 1)",
                  },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};
