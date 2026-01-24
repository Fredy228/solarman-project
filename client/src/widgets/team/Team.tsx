import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "@/src/shared/ui/title/SectionTitle";
import { Box, Container, Typography } from "@mui/material";
import { BicepsFlexed, Brain, Heart, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { listTeam } from "./listTeam";

const LucideIcons = {
  Heart,
  Brain,
  BicepsFlexed,
  Zap,
};

export default function Team() {
  const t = useTranslations("about");

  return (
    <Section
      sx={{
        backgroundColor: "var(--color-secondary)",
      }}
    >
      <Container maxWidth="xl">
        <SectionTitle
          component="h2"
          color="var(--color-text-light)"
          mb={1}
          className="text-center"
        >
          {t("team.title")}
        </SectionTitle>
        <Typography
          variant="subtitle1"
          component="p"
          color="var(--color-text-light)"
          className="text-center whitespace-pre-line"
          maxWidth={"700px"}
          margin={"0 auto 30px auto"}
        >
          {t("team.description")}
        </Typography>

        <Box component={"ul"} className="flex gap-4 flex-wrap justify-center">
          {listTeam(t).map((member) => {
            const IconComponent =
              LucideIcons[member.ico as keyof typeof LucideIcons];
            return (
              <Box
                component={"li"}
                key={member.id}
                className="flex flex-col items-center gap-1 p-10
                w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)]
                bg-(--color-secondary-light) rounded-(--border-radius-main)"
              >
                <Box className="relative pb-12">
                  <Image
                    src={member.photoSrc}
                    alt={member.name}
                    className="block w-full h-full object-cover max-w-[200px] max-h-[200px] rounded-full"
                  />
                  <Box className="absolute bottom-6 bg-(--color-text-light) rounded-full w-12 h-12 flex items-center justify-center left-1/2 -translate-x-1/2">
                    <IconComponent size={25} color="var(--color-secondary)" />
                  </Box>
                </Box>
                <Typography
                  fontWeight={700}
                  color="var(--color-text-light)"
                  component={"h3"}
                  textAlign={"center"}
                  fontSize={18}
                >
                  {member.name}
                </Typography>
                <Typography
                  fontWeight={700}
                  color="var(--color-primary)"
                  component={"p"}
                  textAlign={"center"}
                  fontSize={18}
                >
                  {member.position}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Section>
  );
}
