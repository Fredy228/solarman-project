import { TranslatorType } from "@/src/i18n/types";
import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "@/src/shared/ui/title/SectionTitle";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import { BadgeCheck, FileText, LayoutTemplate, Wrench } from "lucide-react";

const listServices = (t: TranslatorType) => [
  {
    id: 1,
    title: t("services.item1.title"),
    text: t("services.item1.text"),
    ico: LayoutTemplate,
  },
  {
    id: 2,
    title: t("services.item2.title"),
    text: t("services.item2.text"),
    ico: Wrench,
  },
  {
    id: 3,
    title: t("services.item3.title"),
    text: t("services.item3.text"),
    ico: FileText,
  },
  {
    id: 4,
    title: t("services.item4.title"),
    text: t("services.item4.text"),
    ico: BadgeCheck,
  },
];

type Props = {
  t: TranslatorType;
};

export default function Services({ t }: Props) {
  return (
    <Section>
      <Container maxWidth="xl">
        <SectionTitle
          textAlign={"center"}
          mb={3}
          className="whitespace-pre-line"
        >
          {t("services.title")}
        </SectionTitle>

        <Typography
          className="indent-8"
          component={"p"}
          mb={2}
          color="var(--color-text-g2)"
        >
          {t("services.description")}
        </Typography>
        <Typography
          className="indent-8"
          textAlign={"center"}
          component={"h3"}
          fontWeight={700}
          fontSize={"18px"}
          color="var(--color-text-g2)"
          mb={2}
        >
          {t("services.title-list")}
        </Typography>
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {listServices(t).map(({ id, title, text, ico }) => {
            const Icon = ico;
            return (
              <Card key={id} variant="outlined">
                <CardContent>
                  <Box
                    mb={2}
                    className="w-12 h-12 mb-2 mx-auto flex items-center justify-center rounded-full bg-(--color-primary)"
                  >
                    <Icon size={24} color="var(--color-text-light)" />
                  </Box>
                  <Typography
                    component={"h3"}
                    fontWeight={700}
                    textAlign={"center"}
                    color="var(--color-text-g2)"
                    mb={1}
                  >
                    {title}
                  </Typography>
                  <Typography
                    component={"p"}
                    textAlign={"center"}
                    color="var(--color-text-g3)"
                  >
                    {text}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Section>
  );
}
