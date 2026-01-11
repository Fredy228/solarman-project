"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  BanknoteArrowUp,
  Building2,
  ChartNoAxesCombined,
  House,
} from "lucide-react";
import Image from "next/image";

import { Link } from "@/src/i18n/navigation";
import type { IntroLinkItem } from "./introLinkList";

const LucideIcons = {
  Building2,
  House,
  BanknoteArrowUp,
  ChartNoAxesCombined,
};

type Props = {
  list: Array<IntroLinkItem>;
};

export default function IntroLinks({ list }: Props) {
  const theme = useTheme();

  return (
    <Box
      component={"ul"}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10  md:gap-4 lg:gap-5 mt-14"
    >
      {list.map((item) => {
        const IconComponent = LucideIcons[item.ico as keyof typeof LucideIcons];
        return (
          <Box
            component={"li"}
            key={item.id}
            className="group relative rounded-[10px] h-48 lg:h-60 outline-2 outline-transparent outline-solid"
            sx={{
              background:
                "linear-gradient(180deg, rgba(22, 73, 138, 0) 30%,rgba(14, 57, 112, 0.95) 100%)",
              transition: theme.transitions.create(["outline-color"], {
                duration: theme.transitions.duration.shorter,
              }),
              "&:hover": {
                outlineColor: "var(--color-primary)",
              },
            }}
          >
            <Box
              className={`absolute w-14 h-14 rounded-full bg-(--color-secondary) group-hover:bg-(--color-primary) -top-[27px] left-1/2 transform -translate-x-1/2 flex items-center justify-center`}
            >
              {IconComponent && (
                <IconComponent size={27} color="var(--color-text-light)" />
              )}
            </Box>
            <Image
              src={item.imgSrc}
              alt={item.title}
              className="absolute w-full h-full -z-1 rounded-[10px] block object-cover"
            />
            <Link
              href={item.href}
              className="w-full h-full pt-5 pb-5 pl-2.5 pr-2.5 flex flex-col items-center justify-end gap-2.5"
            >
              <Typography
                variant="body1"
                color="var(--color-text-light)"
                className="uppercase font-bold  text-center whitespace-pre-line"
                fontWeight={700}
                fontSize={{ xs: "18px", sm: "18px", md: "14px", lg: "18px" }}
              >
                {item.title}
              </Typography>
            </Link>
          </Box>
        );
      })}
    </Box>
  );
}
