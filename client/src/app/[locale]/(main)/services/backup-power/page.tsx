import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";

import IntroImage from "@/src/assets/intro/services/backup-intro.webp";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import { getTranslations } from "next-intl/server";
import { benefitsList } from "./benefits-list";

type Props = { params: Promise<{ locale: string }> };

export default async function ServiceBackupPowerPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesBackupPower" });

  return (
    <>
      <IntroGradient
        title={t("intro.title")}
        description={t("intro.description")}
        imageSrc={IntroImage}
        buttonText={t("intro.button")}
      />
      <BenefitsSimple title={t("benefits.title")} items={benefitsList(t)} />
    </>
  );
}
