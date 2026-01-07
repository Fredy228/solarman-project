import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import { IntroMain } from "@/src/widgets/intro-main/IntroMain";
import { useTranslations } from "next-intl";
import { homeBenefitsList } from "./list-home-benefits";

export default function Home() {
  const t = useTranslations("home");

  return (
    <>
      <IntroMain />
      <BenefitsSimple title={t("benefits.title")} items={homeBenefitsList(t)} />
    </>
  );
}
