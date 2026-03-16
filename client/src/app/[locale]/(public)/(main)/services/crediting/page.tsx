import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";
import type { Metadata } from "next";

import IntroImage from "@/src/assets/intro/services/debit-intro.webp";
import type { ELocale } from "@/src/i18n/routing";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import Stepper from "@/src/shared/ui/stepper/Stepper";
import { buildMetadata } from "@/src/shared/utils/seo";
import { getTranslations } from "next-intl/server";
import { benefitsList } from "./benefits-list";
import CreditExamples from "./CreditExamples";
import CreditTypes from "./CreditTypes";
import MathBenefits from "./MathBenefits";
import { stepsWorkList } from "./steps-work-list";

type Props = { params: Promise<{ locale: ELocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/services/crediting",
    titles: {
      uk: "Сонячна станція в кредит під 0% в Одесі",
      ru: "Солнечная станция в кредит под 0% в Одессе",
    },
    descriptions: {
      uk: "Отримайте сонячну електростанцію в кредит під 0% або за програмою «5-7-9%» в Одесі. Починайте економити на світлі вже сьогодні, а платіть потім!",
      ru: "Получите солнечную электростанцию в кредит под 0% или по программе «5-7-9%» в Одессе. Начинайте экономить на свете уже сегодня!",
    },
    keywords: {
      uk: [
        "СЕС в кредит",
        "сонячна станція кредит 0",
        "державна програма кредитування",
        "пільговий кредит СЕС",
      ],
      ru: [
        "СЭС в кредит",
        "солнечная станция кредит 0",
        "госпрограмма кредитования",
        "льготный кредит СЭС",
      ],
    },
  });
}

export default async function ServiceCreditingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesCrediting" });

  return (
    <>
      <IntroGradient
        title={t("intro.title")}
        description={t("intro.description")}
        imageSrc={IntroImage}
        buttonText={t("intro.button")}
      />
      <MathBenefits t={t} />
      <CreditTypes t={t} />
      <CreditExamples t={t} />
      <BenefitsSimple title={t("benefits.title")} items={benefitsList(t)} />
      <Stepper
        title={t("stepsWork.title")}
        subtitle={t("stepsWork.subtitle")}
        steps={stepsWorkList(t)}
      />
      <ConsultSection />
    </>
  );
}
