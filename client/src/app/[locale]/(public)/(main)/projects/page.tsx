import { API_LIMITS_ITEMS } from "@/src/configs/api-routes.config";
import { getHashtagsList } from "@/src/features/hashtag/api/get-hashtag-list.api";
import { getPortfolio } from "@/src/features/portfolio/api/get-portfolio.api";
import type { ELocale } from "@/src/i18n/routing";
import PaginationCustom from "@/src/shared/ui/pagination/PaginationCustom";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import {
  buildMetadata,
  hasMeaningfulSearchParams,
} from "@/src/shared/utils/seo";
import Projects from "@/src/widgets/projects/Projects";
import Box from "@mui/material/Box/Box";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: ELocale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;

  return buildMetadata({
    locale,
    path: "/projects",
    titles: {
      uk: "Виконані проекти: сонячні електростанції в Одесі",
      ru: "Выполненные проекты: солнечные электростанции в Одессе",
    },
    descriptions: {
      uk: "Портфоліо реалізованих проектів SolarMan — сонячні електростанції для приватних будинків та бізнесу в Одесі та Одеській області.",
      ru: "Портфолио реализованных проектов SolarMan — солнечные электростанции для частных домов и бизнеса в Одессе и Одесской области.",
    },
    keywords: {
      uk: [
        "проекти сонячних станцій",
        "портфоліо СЕС",
        "встановлені сонячні панелі Одеса",
        "реалізовані проекти",
      ],
      ru: [
        "проекты солнечных станций",
        "портфолио СЭС",
        "установленные солнечные панели Одесса",
        "реализованные проекты",
      ],
    },
    noIndex: hasMeaningfulSearchParams(searchParamsResolved),
  });
}

export default async function ProjectsPage({ searchParams }: Props) {
  const searchParamsResolved = await searchParams;

  const page = searchParamsResolved.page
    ? Array.isArray(searchParamsResolved.page)
      ? parseInt(searchParamsResolved.page[0])
      : parseInt(searchParamsResolved.page)
    : 1;

  const [portfolioResponse, hashtags] = await Promise.all([
    getPortfolio({
      page,
      hashtags: searchParamsResolved.hashtag,
    }),
    getHashtagsList(),
  ]);

  const [portfolioList, totalCount] = portfolioResponse ?? [[], 0];

  return (
    <>
      <Box height={"30px"}></Box>
      <Projects data={portfolioList || []} hashtags={hashtags} />
      <PaginationCustom
        count={Math.ceil(totalCount / API_LIMITS_ITEMS.portfolio)}
        page={page}
      />
      <Box height={"40px"}></Box>
      <ConsultSection />
    </>
  );
}
