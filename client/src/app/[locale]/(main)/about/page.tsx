import imageIntro from "@/src/assets/services/enterprise-intro.webp";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";
import OurMission from "@/src/widgets/our-mission/OurMission";
import Team from "@/src/widgets/team/Team";
import { getTranslations } from "next-intl/server";
import { listAchievements } from "./listAchivements";

type Props = { params: Promise<{ locale: string }> };

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
    </>
  );
}
