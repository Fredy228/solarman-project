import imageIntro from "@/src/assets/services/enterprise-intro.webp";
import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";
import OurMission from "@/src/widgets/our-mission/OurMission";
import { getTranslations } from "next-intl/server";

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
    </>
  );
}
