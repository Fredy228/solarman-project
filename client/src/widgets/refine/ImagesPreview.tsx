"use client";

import { Box, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDelete } from "@refinedev/core";
import Image from "next/image";
import { IPortfolio } from "@/src/features/portfolio";

export const ImagesPreview = ({ images }: { images: IPortfolio["images"] }) => {
  const { mutate: deleteImage } = useDelete();

  const handleDelete = (id: string) => {
    deleteImage({
      resource: "portfolio/image",
      id,
    });
  };

  if (!images) return null;

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      {images.map((image) => {
        if (typeof image !== "string") return null;
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
