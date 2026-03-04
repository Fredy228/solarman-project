"use client";

import { Box, Dialog, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { startTransition, useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

type Props = {
  images: string[];
};

const normalizeCoverUrl = (src: string) => {
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  ) {
    return src;
  }
  return `/${src}`;
};

export default function ImageSlider({ images }: Props) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const modalPrevRef = useRef<HTMLButtonElement | null>(null);
  const modalNextRef = useRef<HTMLButtonElement | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const modalSwiperRef = useRef<SwiperType | null>(null);
  const isMountedRef = useRef(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialSlide, setModalInitialSlide] = useState(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleOpenModal = (index: number) => {
    if (!isMountedRef.current) return;
    startTransition(() => {
      if (isMountedRef.current) {
        setModalInitialSlide(index);
        setIsModalOpen(true);
      }
    });
  };

  const handleCloseModal = () => {
    if (!isMountedRef.current) return;
    startTransition(() => {
      if (isMountedRef.current) {
        setIsModalOpen(false);
      }
    });
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        width: "100%",
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
      })}
    >
      <button
        ref={prevRef}
        type="button"
        className="image-slider-nav image-slider-prev"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        ref={nextRef}
        type="button"
        className="image-slider-nav image-slider-next"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      <Swiper
        modules={[FreeMode, Navigation]}
        navigation={false}
        onBeforeInit={(swiper) => {
          mainSwiperRef.current = swiper;
          if (typeof swiper.params.navigation !== "boolean") {
            if (!swiper.params.navigation) {
              swiper.params.navigation = {};
            }
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
          if (swiper.navigation) {
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        spaceBetween={8}
        slidesPerView="auto"
        freeMode={true}
        watchSlidesProgress={true}
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
        className="h-[350px] sm:h-[250px] md:h-[350px]"
      >
        {images.map((src, idx) => {
          const url = normalizeCoverUrl(src);
          return (
            <SwiperSlide
              key={url + idx}
              className="w-full sm:w-auto! h-auto sm:h-full"
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  borderRadius: "var(--border-radius-main)",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => handleOpenModal(idx)}
              >
                <Image
                  src={url}
                  alt={`Image ${idx + 1}`}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover sm:h-full sm:w-auto"
                  priority={idx === 0}
                  loading={idx === 0 ? "eager" : "lazy"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth={false}
        fullScreen
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0, 0, 0, 0.95)",
            m: 0,
          },
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseModal();
          }
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1300,
              color: "white",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <X size={24} />
          </IconButton>

          <Box
            sx={(theme) => ({
              position: "relative",
              width: "100%",
              height: "100%",
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ".modal-gallery-nav": {
                position: "absolute",
                cursor: "pointer",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1200,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: "999px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  transform: "translateY(-50%) scale(1.05)",
                },
                "&:disabled": {
                  opacity: 0.3,
                  cursor: "not-allowed",
                },
              },
              ".modal-gallery-prev": {
                left: theme.spacing(2),
              },
              ".modal-gallery-next": {
                right: theme.spacing(2),
              },
            })}
          >
            <button
              ref={modalPrevRef}
              type="button"
              className="modal-gallery-nav modal-gallery-prev"
              aria-label="Previous slide"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              ref={modalNextRef}
              type="button"
              className="modal-gallery-nav modal-gallery-next"
              aria-label="Next slide"
            >
              <ChevronRight size={32} />
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={false}
              initialSlide={modalInitialSlide}
              onBeforeInit={(swiper) => {
                modalSwiperRef.current = swiper;
                if (typeof swiper.params.navigation !== "boolean") {
                  if (!swiper.params.navigation) {
                    swiper.params.navigation = {};
                  }
                  swiper.params.navigation.prevEl = modalPrevRef.current;
                  swiper.params.navigation.nextEl = modalNextRef.current;
                }
              }}
              onSwiper={(swiper) => {
                modalSwiperRef.current = swiper;
                if (swiper.navigation) {
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              }}
              spaceBetween={20}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "90vw",
                maxHeight: "90vh",
              }}
              onClick={(swiper, e) => {
                const target = e.target as HTMLElement;
                if (
                  !target.closest(".swiper-slide") ||
                  target.closest(".modal-gallery-nav")
                ) {
                  handleCloseModal();
                }
              }}
            >
              {images.map((src, idx) => {
                const url = normalizeCoverUrl(src);
                return (
                  <SwiperSlide
                    key={url + idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={(e) => {
                        if (e.target === e.currentTarget) {
                          handleCloseModal();
                        }
                      }}
                    >
                      <Image
                        src={url}
                        alt={`Image ${idx + 1}`}
                        fill
                        sizes="90vw"
                        style={{
                          objectFit: "contain",
                        }}
                        priority={idx === modalInitialSlide}
                        loading={idx === modalInitialSlide ? "eager" : "lazy"}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </Box>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
