"use client";

import { Box } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  images: string[];
};

export default function ImageSlider({ images }: Props) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Box
      className="w-full"
      sx={(theme) => ({
        position: "relative",
        ".swiper": {
          "--swiper-pagination-bullet-size": "10px",
          "--swiper-pagination-bullet-horizontal-gap": "6px",
        },
        ".swiper-button-prev, .swiper-button-next": {
          display: "none",
        },
        ".swiper-pagination": {
          display: "inline-flex",
          alignItems: "center",
          width: "auto",
          left: "50%",
          right: "auto",
          transform: "translateX(-50%)",
          padding: "3px 6px",
          borderRadius: "20px",
          backgroundColor: "var(--color-text-light)",
          //   backdropFilter: "blur(6px)",
        },
        ".swiper-pagination-bullet": {
          backgroundColor: theme.palette.secondary.main,
        },
        ".swiper-pagination-bullet-active": {
          backgroundColor: theme.palette.primary.main,
        },
        ".image-slider-nav": {
          position: "absolute",
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
      })}
    >
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
        modules={[FreeMode, Navigation, Pagination]}
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
        pagination={{ clickable: true }}
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
        className="h-[350px]"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="w-full sm:w-auto! h-auto sm:h-full"
          >
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
