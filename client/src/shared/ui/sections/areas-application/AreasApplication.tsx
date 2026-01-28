import { Box, Container, Typography } from "@mui/material";
import { Check } from "lucide-react";
import SectionTitle from "../../title/SectionTitle";
import Section from "../Section";

type Props = {
  title: string;
  description: string;
  list: string[];
};

export default function AreasApplication({ title, description, list }: Props) {
  return (
    <Section bgcolor={"secondary.main"} color={"var(--color-text-light)"}>
      <Container maxWidth="xl">
        <Box className="flex flex-col gap-10 md:flex-row">
          <Box className="w-full md:w-[350px]">
            <SectionTitle
              color="var(--color-text-light)"
              mb={1}
              className="text-center md:text-left"
            >
              {title}
            </SectionTitle>
            <Typography
              component={"p"}
              variant="subtitle1"
              color="var(--color-text-light)"
              className="text-center md:text-left"
            >
              {description}
            </Typography>
          </Box>
          <Box
            component={"ul"}
            className="grid flex-1 grid-cols-2 gap-5 lg:grid-cols-3"
          >
            {list.map((item, index) => (
              <Box
                key={index}
                component={"li"}
                className="flex items-center gap-3"
              >
                <Box className="w-[45px] h-[45px] flex justify-center items-center rounded-full border-2 border-(--color-primary)">
                  <Check size={25} color="var(--color-primary)" />
                </Box>
                <Typography component={"span"}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Section>
  );
}
