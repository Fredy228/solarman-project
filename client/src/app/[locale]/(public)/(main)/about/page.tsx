import imageIntro from "@/src/assets/intro/services/enterprise-intro.webp";
import type { ELocale } from "@/src/i18n/routing";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";
import { buildMetadata } from "@/src/shared/utils/seo";
import OurMission from "@/src/widgets/our-mission/OurMission";
import SolarmanIs from "@/src/widgets/solarman-is/SolarmanIs";
import Team from "@/src/widgets/team/Team";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { listAchievements } from "./listAchivements";

type Props = { params: Promise<{ locale: ELocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/about",
    titles: {
      uk: "Про нас",
      ru: "О нас",
    },
    descriptions: {
      uk: "Команда SolarMan — досвідчені фахівці у встановленні сонячних електростанцій в Одесі. Понад 100 успішних проектів від 3 до 200 кВт в Одесі та Одеській області.",
      ru: "Команда SolarMan — опытные специалисты по установке солнечных электростанций в Одессе. Более 100 успешных проектов от 3 до 200 кВт в Одессе и Одесской области.",
    },
    keywords: {
      uk: [
        "SolarMan про нас",
        "сонячні електростанції Одеса",
        "команда SolarMan",
        "встановлення СЕС Одеса",
      ],
      ru: [
        "SolarMan о нас",
        "солнечные электростанции Одесса",
        "команда SolarMan",
        "установка СЭС Одесса",
      ],
    },
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <IntroGradient
        title={t("intro.title")}
        description={t("intro.description")}
        imageSrc={imageIntro}
      />
      <OurMission />
      <BenefitsSimple items={listAchievements(t)} />
      <Team />
      <SolarmanIs />
      <ConsultSection />
    </>
  );
}
