import BlogCard from "@/src/features/blog/components/blog-card/BlogCard";
import type { IBlogItem } from "@/src/features/blog/types/blog.interface";
import Section from "@/src/shared/ui/sections/Section";
import PageTitle from "@/src/shared/ui/title/PageTitle";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import BlogToolbar from "./BlogToolbar";

type Props = {
  data: IBlogItem[];
};

export default function BlogList({ data }: Props) {
  const t = useTranslations("blog");

  return (
    <Section>
      <Container maxWidth="xl">
        <PageTitle textAlign={"center"} mb={1}>
          {t("title")}
        </PageTitle>
        <Typography
          component={"p"}
          variant="subtitle1"
          margin={"0 auto 20px auto"}
          textAlign={"center"}
          maxWidth={"900px"}
        >
          {t("description")}
        </Typography>
        <Suspense>
          <BlogToolbar />
        </Suspense>
        <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {data.map((item) => (
            <BlogCard key={item.id} data={item} />
          ))}
        </Box>
      </Container>
    </Section>
  );
}
