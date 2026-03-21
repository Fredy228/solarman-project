import { Box, Container, Stack, Typography } from "@mui/material";
import {
  BanknoteArrowUp,
  BatteryCharging,
  ChevronsRight,
  Earth,
  FileStack,
  Globe,
  Goal,
  HandCoins,
  Landmark,
  PiggyBank,
  Power,
  RefreshCw,
  Scale,
  ShieldCheck,
  Smile,
  Sun,
  TrendingUp,
  VolumeX,
  Wrench,
  Zap,
} from "lucide-react";

import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "../../title/SectionTitle";
import type { BenefitSimpleItemType } from "./types/benefit-simple-item.type";

const LucideIcons = {
  Zap,
  HandCoins,
  BanknoteArrowUp,
  PiggyBank,
  Earth,
  Power,
  Smile,
  ShieldCheck,
  RefreshCw,
  Sun,
  Scale,
  VolumeX,
  TrendingUp,
  Wrench,
  Globe,
  BatteryCharging,
  FileStack,
  ChevronsRight,
  Goal,
  Landmark,
};

type Props = {
  title?: string;
  subtitle?: string;
  items: Array<BenefitSimpleItemType>;
};

export default function BenefitsSimple({ title, subtitle, items }: Props) {
  return (
    <Section>
      <Container maxWidth="xl">
        {title && (
          <>
            <SectionTitle component="h2" className="text-center">
              {title}
            </SectionTitle>
            {subtitle && (
              <Typography
                variant="subtitle1"
                component="p"
                className="text-center"
              >
                {subtitle}
              </Typography>
            )}
            <Box height={40} />
          </>
        )}
        <Box component={"ul"} className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {items.map(({ id, title, text, ico }) => {
            const IconComponent = LucideIcons[ico as keyof typeof LucideIcons];
            return (
              <Stack key={id} component={"li"} direction={"row"} gap={2}>
                <Box>
                  <Box className="w-12 h-12 rounded-full bg-(--color-primary) flex items-center justify-center">
                    <IconComponent size={25} color="var(--color-text-light)" />
                  </Box>
                </Box>
                <Box>
                  <Typography
                    component={"h3"}
                    fontWeight={700}
                    fontSize={"18px"}
                    className="text-(--color-text-g2) pb-2.5"
                  >
                    {title}
                  </Typography>
                  <Typography
                    component={"p"}
                    className="text-(--color-text-g3)"
                  >
                    {text}
                  </Typography>
                </Box>
              </Stack>
            );
          })}
        </Box>
      </Container>
    </Section>
  );
}
