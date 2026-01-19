import { API_LIMITS_ITEMS } from "@/src/configs/api-routes.config";
import { getHashtagsList } from "@/src/features/hashtag/api/get-hashtag-list.api";
import { getPortfolio } from "@/src/features/portfolio/api/get-portfolio.api";
import PaginationCustom from "@/src/shared/ui/pagination/PaginationCustom";
import Projects from "@/src/widgets/projects/Projects";
import Box from "@mui/material/Box/Box";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProjectsPage({ searchParams }: Props) {
  const searchParamsResolved = await searchParams;

  const page = searchParamsResolved.page
    ? Array.isArray(searchParamsResolved.page)
      ? parseInt(searchParamsResolved.page[0])
      : parseInt(searchParamsResolved.page)
    : 1;

  const portfolioResponse = await getPortfolio({
    page,
    hashtag: searchParamsResolved.hashtag
      ? Array.isArray(searchParamsResolved.hashtag)
        ? searchParamsResolved.hashtag[0]
        : searchParamsResolved.hashtag
      : undefined,
  });
  const hashtags = await getHashtagsList();

  const [portfolioList, totalCount] = portfolioResponse ?? [[], 0];

  return (
    <>
      <Box height={"30px"}></Box>
      <Projects data={portfolioList || []} hashtags={hashtags} />
      <PaginationCustom
        count={Math.ceil(totalCount / API_LIMITS_ITEMS.portfolio)}
        page={page}
      />
    </>
  );
}
