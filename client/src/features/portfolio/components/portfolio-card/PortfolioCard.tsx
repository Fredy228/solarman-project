import { PUBLIC_ROUTES } from "@/src/configs/routes.config";
import { Link as NavLink } from "@/src/i18n/navigation";
import type { ELocale } from "@/src/i18n/routing";
import IconLogoMain from "@/src/shared/ui/icons/IconLogoMain";
import { Box, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useLocale } from "next-intl";
import Image from "next/image";
import type { IPortfolioItem } from "../../types/portfolio.interface";

type Props = {
  data: IPortfolioItem;
};

export default function PortfolioCard({
  data: { title, cover, date, tag },
}: Props) {
  const locale = useLocale() as ELocale;

  return (
    <Paper
      elevation={3}
      sx={{ borderRadius: "var(--border-radius-main)" }}
      className="h-full"
    >
      <NavLink
        className="group h-full flex flex-col"
        href={`${PUBLIC_ROUTES.projects}/${tag}`}
      >
        <Box className="w-full aspect-video rounded-(--border-radius-main) overflow-hidden">
          <Image
            src={cover}
            alt={title[locale]}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </Box>
        <Box className="pl-4 pr-4 pt-4 group-hover:text-(--color-primary)">
          <Typography
            component={"p"}
            fontWeight={600}
            sx={{ transition: "color 200ms" }}
          >
            {title[locale]}
          </Typography>
        </Box>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          className="p-4 mt-auto"
        >
          <Box>
            <IconLogoMain
              viewBox="0 0 82 32"
              sx={{ height: "20px", width: "auto" }}
            />
          </Box>
          <Typography color="var(--color-text-g4)" fontSize={14}>
            {dayjs(date).locale(locale).format("DD.MM.YYYY")}
          </Typography>
        </Stack>
      </NavLink>
    </Paper>
  );
}
