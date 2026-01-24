"use client";

import { Box, GlobalStyles } from "@mui/material";
import type { LightGallery as LightGalleryInstance } from "lightgallery/lightgallery";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import LightGallery from "lightgallery/react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lightgallery.css";
import "swiper/css";
import "swiper/css/navigation";

type Props = {
  images: string[];
};

export default function ImageSlider({ images }: Props) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const galleryRef = useRef<LightGalleryInstance | null>(null);

  return (
    <Box
      className="w-full"
      sx={(theme) => ({
        position: "relative",
        ".image-slider-nav": {
          position: "absolute",
          cursor: "pointer",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "999px",
          backgroundColor: "var(--color-text-light)",
          color: theme.palette.primary.main,
          boxShadow: theme.shadows[2],
          transition: "transform 0.2s ease, opacity 0.2s ease",
          "&:hover": {
            transform: "translateY(-50%) scale(1.05)",
          },
          "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },
        },
        ".image-slider-prev": {
          left: theme.spacing(1),
        },
        ".image-slider-next": {
          right: theme.spacing(1),
        },
        ".image-slider-slide": {
          position: "relative",
        },
        ".image-slider-zoom": {
          position: "absolute",
          cursor: "pointer",
          top: 8,
          right: 8,
          zIndex: 2,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
          borderRadius: "10px",
          backgroundColor: "var(--color-text-light)",
          color: theme.palette.primary.main,
          boxShadow: theme.shadows[2],
          transition: "transform 0.2s ease, opacity 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
      })}
    >
      <GlobalStyles
        styles={(theme) => ({
          ".lg-container, .lg-outer, .lg-backdrop": {
            zIndex: theme.zIndex.modal + 10,
          },
          "body.lg-on": {
            overflow: "hidden",
          },
        })}
      />
      <LightGallery
        dynamic
        dynamicEl={images.map((src) => ({ src, thumb: src }))}
        plugins={[lgFullscreen, lgThumbnail]}
        onInit={(detail) => {
          galleryRef.current = detail.instance;
        }}
        download={false}
        thumbnail={true}
        // showThumbByDefault={true}
        hideScrollbar={true}
      />
      <button
        ref={prevRef}
        type="button"
        className="image-slider-nav image-slider-prev"
        aria-label="Previous slide"
      >
        <ChevronLeft size={25} />
      </button>
      <button
        ref={nextRef}
        type="button"
        className="image-slider-nav image-slider-next"
        aria-label="Next slide"
      >
        <ChevronRight size={25} />
      </button>
      <Swiper
        init={true}
        modules={[FreeMode, Navigation]}
        spaceBetween={8}
        navigation={true}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation === "boolean") return;
          if (!swiper.params.navigation) {
            swiper.params.navigation = {};
          }
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        freeMode={true}
        slidesPerView="auto"
        breakpoints={{
          0: {
            slidesPerView: 1,
            freeMode: false,
          },
          600: {
            slidesPerView: "auto",
            freeMode: true,
          },
        }}
        watchSlidesProgress={true}
        className="h-[350px] sm:h-[250px] md:h-[350px]"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="image-slider-slide w-full sm:w-auto! h-auto sm:h-full"
          >
            <button
              type="button"
              className="image-slider-zoom"
              aria-label="Open fullscreen"
              onClick={(event) => {
                event.stopPropagation();
                galleryRef.current?.openGallery(index);
              }}
            >
              <Maximize2 size={18} />
            </button>
            <Image
              src={image}
              alt={`Image ${index + 1}`}
              width={500}
              height={500}
              className="h-full w-full object-cover rounded-(--border-radius-main) sm:h-full sm:w-auto"
              priority={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
