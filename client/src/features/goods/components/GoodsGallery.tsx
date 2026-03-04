"use client";

import { Box, Dialog, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

type GoodsGalleryProps = {
  images: string[];
  title: string;
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

export default function GoodsGallery({ images, title }: GoodsGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialSlide, setModalInitialSlide] = useState(0);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const modalPrevRef = useRef<HTMLButtonElement | null>(null);
  const modalNextRef = useRef<HTMLButtonElement | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const modalSwiperRef = useRef<SwiperType | null>(null);
  const isMountedRef = useRef(true);
  const items = useMemo(
    () => (images && images.length > 0 ? images : []),
    [images],
  );

  // Cleanup on unmount
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

  if (items.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          borderRadius: 2,
          border: "1px dashed",
          borderColor: "divider",
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
        }}
      >
        {title}
      </Box>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        width: "100%",
        ".goods-gallery-nav": {
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
        ".goods-gallery-prev": {
          left: theme.spacing(1),
        },
        ".goods-gallery-next": {
          right: theme.spacing(1),
        },
      })}
    >
      <Box
        className="goods-gallery-main"
        sx={{ position: "relative", width: "100%", mx: "auto" }}
      >
        <button
          ref={prevRef}
          type="button"
          className="goods-gallery-nav goods-gallery-prev"
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          ref={nextRef}
          type="button"
          className="goods-gallery-nav goods-gallery-next"
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>
        <Swiper
          modules={[FreeMode, Navigation, Thumbs]}
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
            // Initialize navigation after mount
            if (swiper.navigation) {
              swiper.navigation.init();
              swiper.navigation.update();
            }
          }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          watchSlidesProgress
          spaceBetween={12}
          onSlideChange={(swiper) => {
            if (!isMountedRef.current) return;
            startTransition(() => {
              if (isMountedRef.current) {
                setActiveIndex(swiper.activeIndex);
              }
            });
          }}
          className="w-full"
        >
          {items.map((src, idx) => {
            const url = normalizeCoverUrl(src);
            return (
              <SwiperSlide key={url + idx}>
                <Box
                  sx={{
                    width: "100%",
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                    cursor: "pointer",
                  }}
                  className="aspect-square"
                  onClick={() => handleOpenModal(idx)}
                >
                  <Image
                    src={url}
                    alt={title || "product image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="block object-cover w-full h-full"
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
      </Box>

      <Box
        sx={{
          mt: 1.5,
          mx: "auto",
        }}
      >
        <Swiper
          onSwiper={(swiper) => {
            if (isMountedRef.current) {
              setThumbsSwiper(swiper);
            }
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          spaceBetween={8}
          slidesPerView="auto"
          freeMode
          watchSlidesProgress
          watchOverflow
          slideToClickedSlide
          style={{ width: "100%" }}
        >
          {items.map((src, idx) => {
            const url = normalizeCoverUrl(src);
            return (
              <SwiperSlide
                key={url + idx}
                style={{ width: 72, maxWidth: "25%" }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    borderRadius: 1,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor:
                      activeIndex === idx ? "primary.main" : "divider",
                    boxShadow:
                      activeIndex === idx
                        ? "0 0 0 2px rgba(25, 118, 210, 0.25)"
                        : "none",
                    cursor: "pointer",
                  }}
                  className="aspect-square"
                >
                  <Image
                    src={url}
                    alt={`${title || "product image"} thumbnail ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 25vw, 72px"
                    className="object-cover"
                    loading="lazy"
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
                // Initialize navigation after mount
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
              {items.map((src, idx) => {
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
                        alt={title || "product image"}
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
