import { Box, Container, Stack, Typography } from "@mui/material";

import Section from "@/src/shared/ui/sections/Section";
import Image from "next/image";
import SectionTitle from "../../title/SectionTitle";
import type { BenefitWithImgItemType } from "./types/benefit-with-img-item.type";

type Props = {
  title?: string;
  subtitle?: string;
  items: Array<BenefitWithImgItemType>;
};

export default function BenefitsWithImage({ title, subtitle, items }: Props) {
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
          {items.map(({ id, title, text, img }) => {
            return (
              <Stack key={id} component={"li"} direction={"row"} gap={2}>
                <Box>
                  <Image
                    src={img}
                    alt={title}
                    className="aspect-square w-[70px] sm:w-[150px] rounded-(--border-radius-main) object-cover"
                  />
                </Box>
                <Box>
                  <Typography
                    component={"h4"}
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
