import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";
import type { Metadata } from "next";

import IntroImage from "@/src/assets/intro/services/backup-intro.webp";
import { STATIC_HASHTAGS } from "@/src/features/hashtag/list-static-hashtag-tag";
import { getLastPortfolio } from "@/src/features/portfolio/api/get-last-portfolio.api";
import PortfolioPreview from "@/src/features/portfolio/components/portfolio-preview/PortfolioPreview";
import type { ELocale } from "@/src/i18n/routing";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import BenefitsWithImage from "@/src/shared/ui/sections/benefits-with-image/BenefitsWithImage";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import Stepper from "@/src/shared/ui/stepper/Stepper";
import { buildMetadata } from "@/src/shared/utils/seo";
import { getTranslations } from "next-intl/server";
import { benefitsImageList } from "./benefits-image-list";
import { benefitsList } from "./benefits-list";
import { stepsWorkList } from "./steps-work-list";

type Props = { params: Promise<{ locale: ELocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/services/backup-power",
    titles: {
      uk: "Системи безперебійного живлення (ДБЖ) в Одесі",
      ru: "Системы бесперебойного питания (ИБП) в Одессе",
    },
    descriptions: {
      uk: "Встановлення систем безперебійного живлення на базі LiFePO4 в Одесі. Автоматичне перемикання, тиша робота, захист від відключень енергії.",
      ru: "Установка систем бесперебойного питания на базе LiFePO4 в Одессе. Автоматическое переключение, тихая работа, защита от отключений энергии.",
    },
    keywords: {
      uk: [
        "ДБЖ Одеса",
        "безперебійне живлення",
        "LiFePO4 акумулятор",
        "захист від відключень світла",
        "резервне живлення",
      ],
      ru: [
        "ИБП Одесса",
        "бесперебойное питание",
        "LiFePO4 аккумулятор",
        "защита от отключений света",
        "резервное питание",
      ],
    },
  });
}

export default async function ServiceBackupPowerPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesBackupPower" });

  const portfolioList = await getLastPortfolio([STATIC_HASHTAGS.UPS]);

  return (
    <>
      <IntroGradient
        title={t("intro.title")}
        description={t("intro.description")}
        imageSrc={IntroImage}
        buttonText={t("intro.button")}
      />
      <BenefitsSimple title={t("benefits.title")} items={benefitsList(t)} />
      <BenefitsWithImage
        title={t("equipment.title")}
        items={benefitsImageList(t)}
      />
      {portfolioList && portfolioList.length > 0 && (
        <PortfolioPreview
          data={portfolioList}
          hashtags={[STATIC_HASHTAGS.UPS]}
        />
      )}
      <Stepper
        title={t("stepsWork.title")}
        subtitle={t("stepsWork.subtitle")}
        steps={stepsWorkList(t)}
      />
      <ConsultSection />
    </>
  );
}
