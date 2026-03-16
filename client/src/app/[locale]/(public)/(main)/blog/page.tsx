import { Box } from "@mui/material";
import type { Metadata } from "next";

import { API_LIMITS_ITEMS } from "@/src/configs/api-routes.config";
import { getBlogList } from "@/src/features/blog/api/get-blog-list.api";
import type { ELocale } from "@/src/i18n/routing";
import PaginationCustom from "@/src/shared/ui/pagination/PaginationCustom";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import { buildMetadata } from "@/src/shared/utils/seo";
import BlogList from "@/src/widgets/blog/BlogList";

type Props = {
  params: Promise<{ locale: ELocale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/blog",
    titles: {
      uk: "Блог про сонячну енергетику",
      ru: "Блог о солнечной энергетике",
    },
    descriptions: {
      uk: "Корисні статті про сонячні електростанції, енергонезалежність, обладнання та новини галузі від команди SolarMan.",
      ru: "Полезные статьи о солнечных электростанциях, энергонезависимости, оборудовании и новостях отрасли от команды SolarMan.",
    },
    keywords: {
      uk: [
        "сонячна енергетика блог",
        "СЕС статті",
        "сонячні панелі поради",
        "енергонезалежність",
      ],
      ru: [
        "солнечная энергетика блог",
        "СЭС статьи",
        "солнечные панели советы",
        "энергонезависимость",
      ],
    },
  });
}

export default async function BlogPage({ searchParams }: Props) {
  const searchParamsResolved = await searchParams;

  const pageRaw = searchParamsResolved.page;
  const page = Math.max(
    1,
    parseInt((Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) ?? "1", 10) || 1,
  );

  const titleRaw = searchParamsResolved.title_like;
  const title_like = Array.isArray(titleRaw) ? titleRaw[0] : titleRaw;

  const orderRaw = searchParamsResolved._order;
  const orderValue = Array.isArray(orderRaw) ? orderRaw[0] : orderRaw;
  const order: "asc" | "desc" = orderValue === "asc" ? "asc" : "desc";

  const blogResponse = await getBlogList({ page, title_like, order });
  const [blogList, totalCount] = blogResponse ?? [[], 0];
  const totalPages = Math.max(1, Math.ceil(totalCount / API_LIMITS_ITEMS.blog));

  return (
    <>
      <Box height={30} />
      <BlogList data={blogList} />
      <PaginationCustom count={totalPages} page={page} />
      <Box height={40} />
      <ConsultSection />
    </>
  );
}
