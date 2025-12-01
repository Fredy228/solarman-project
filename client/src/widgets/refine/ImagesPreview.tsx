"use client";

import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDelete } from "@refinedev/core";
import Image from "next/image";
import { IPortfolio } from "@/src/features/portfolio";
import { useState } from "react";

export const ImagesPreview = ({
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

  const handleDelete = (imageWillDelete: string) => {
    if (!id) return;
    deleteImage(
      {
        resource,
        id,
        values: {
          image: imageWillDelete,
        },
      },
      {
        onSuccess: async () => {
          setSavedImages((prev) =>
            prev.filter((item) => item !== imageWillDelete),
          );
        },
      },
    );
  };

  if (!images) return null;

  return (
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
              onClick={() => handleDelete(image)}
            >
              <Close />
            </IconButton>
          </Box>
        );
      })}
    </Box>
  );
};
