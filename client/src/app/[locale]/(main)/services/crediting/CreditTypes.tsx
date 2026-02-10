import { TranslatorType } from "@/src/i18n/types";
import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "@/src/shared/ui/title/SectionTitle";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Goal,
  UserRound,
} from "lucide-react";

const creditTypesList = (t: TranslatorType) => [
  {
    id: 1,
    title: t("creditTypes.item1.title"),
    text: t("creditTypes.item1.text"),
    requirements: t("creditTypes.item1.requirements"),
    goal: t("creditTypes.item1.goal"),
    ico: UserRound,
  },
  {
    id: 2,
    title: t("creditTypes.item2.title"),
    text: t("creditTypes.item2.text"),
    requirements: t("creditTypes.item2.requirements"),
    goal: t("creditTypes.item2.goal"),
    ico: BriefcaseBusiness,
  },
  {
    id: 3,
    title: t("creditTypes.item3.title"),
    text: t("creditTypes.item3.text"),
    requirements: t("creditTypes.item3.requirements"),
    goal: t("creditTypes.item3.goal"),
    ico: Building2,
  },
];

type Props = {
  t: TranslatorType;
};

export default function CreditTypes({ t }: Props) {
  return (
    <Section>
      <Container maxWidth="xl">
        <SectionTitle textAlign={"center"} mb={1}>
          {t("creditTypes.title")}
        </SectionTitle>
        <Typography
          component={"p"}
          variant="subtitle1"
          textAlign={"center"}
          maxWidth={900}
          mx={"auto"}
          mb={5}
        >
          {t("creditTypes.description")}
        </Typography>

        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creditTypesList(t).map(
            ({ id, title, text, ico, requirements, goal }) => {
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
                      whiteSpace={"pre-line"}
                    >
                      {title}
                    </Typography>
                    <Typography
                      component={"p"}
                      textAlign={"left"}
                      color="var(--color-text-g3)"
                      fontSize={16}
                      mb={1}
                      className="indent-5"
                    >
                      {text}
                    </Typography>
                    <Typography
                      color="var(--color-text-g3)"
                      fontSize={16}
                      mb={1}
                    >
                      <ClipboardList
                        className="inline-block"
                        size={16}
                        color="var(--color-primary)"
                      />{" "}
                      {t("creditTypes.names.requirements")}: {requirements}
                    </Typography>
                    <Typography color="var(--color-text-g3)" fontSize={16}>
                      <Goal
                        className="inline-block"
                        size={16}
                        color="var(--color-primary)"
                      />{" "}
                      {t("creditTypes.names.goal")}: {goal}
                    </Typography>
                  </CardContent>
                </Card>
              );
            },
          )}
        </Box>
      </Container>
    </Section>
  );
}
