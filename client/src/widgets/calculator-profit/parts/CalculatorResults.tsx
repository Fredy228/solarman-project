import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { ReactNode } from "react";

import ImageSolarFlash from "@/src/assets/calculator/flash.png";
import ImageMoneySaving from "@/src/assets/calculator/money-saving.png";
import ImagePerfomance from "@/src/assets/calculator/performance.png";
import ImageProfit from "@/src/assets/calculator/profit.png";
import ImageRefund from "@/src/assets/calculator/refund.png";
import ImageSolarPanel from "@/src/assets/calculator/solar-panel.png";

type Props = {
  results: {
    costInstalledStation: string; // Вартість встановленій станції
    profitEntirePeriodOperation: string; // Прибуток від станції за весь срок експлуатації
    paybackPeriodStation: string; // Окупність станції
    averageSavingsPerKw: string; // Середня економія за 1 кВт
    returnOnInvestment: string; // Рентабельність інвестицій
    averageElectricityGeneration: string; // Середнії виробіток електроенергіх за допомогою СЕС
  };
};

const ItemResult = ({ children }: { children?: ReactNode }) => {
  return (
    <Box className="flex items-center p-2.5 rounded-(--border-radius-main) border-2 border-(--color-secondary)">
      {children}
    </Box>
  );
};

const ItemResultWrapper = ({ children }: { children?: ReactNode }) => {
  return <Box className="flex-1">{children}</Box>;
};

const ItemResultLabel = ({ children }: { children?: ReactNode }) => {
  return (
    <Typography color="var(--color-text-g4)" fontSize={15}>
      {children}
    </Typography>
  );
};

const ItemResultValue = ({ children }: { children?: ReactNode }) => {
  return (
    <Typography color="var(--color-secondary)" fontSize={22} fontWeight={700}>
      {children}
    </Typography>
  );
};

export default function CalculatorResults({ results }: Props) {
  const t = useTranslations("common");

  return (
    <Box className="grid grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
      <ItemResult>
        <ItemResultWrapper>
          <ItemResultLabel>
            {t("calculator.results.costInstalledStation")}
          </ItemResultLabel>
          <ItemResultValue>{results.costInstalledStation}</ItemResultValue>
        </ItemResultWrapper>
        <Image
          src={ImageSolarPanel}
          alt="Solar Panel"
          className="block w-14 h-14"
        />
      </ItemResult>

      <ItemResult>
        <ItemResultWrapper>
          <ItemResultLabel>
            {t("calculator.results.profitEntirePeriodOperation")}
          </ItemResultLabel>
          <ItemResultValue>
            {results.profitEntirePeriodOperation}
          </ItemResultValue>
        </ItemResultWrapper>
        <Image src={ImageProfit} alt="Profit" className="block w-14 h-14" />
      </ItemResult>

      <ItemResult>
        <ItemResultWrapper>
          <ItemResultLabel>
            {t("calculator.results.paybackPeriodStation")}
          </ItemResultLabel>
          <ItemResultValue>{results.paybackPeriodStation}</ItemResultValue>
        </ItemResultWrapper>
        <Image src={ImageRefund} alt="Refund" className="block w-14 h-14" />
      </ItemResult>

      <ItemResult>
        <ItemResultWrapper>
          <ItemResultLabel>
            {t("calculator.results.averageSavingsPerKw")}
          </ItemResultLabel>
          <ItemResultValue>{results.averageSavingsPerKw}</ItemResultValue>
        </ItemResultWrapper>
        <Image
          src={ImageMoneySaving}
          alt="Money Saving"
          className="block w-14 h-14"
        />
      </ItemResult>

      <ItemResult>
        <ItemResultWrapper>
          <ItemResultLabel>
            {t("calculator.results.returnOnInvestment")}
          </ItemResultLabel>
          <ItemResultValue>{results.returnOnInvestment}</ItemResultValue>
        </ItemResultWrapper>
        <Image
          src={ImagePerfomance}
          alt="Performance"
          className="block w-14 h-14"
        />
      </ItemResult>

      <ItemResult>
        <ItemResultWrapper>
          <ItemResultLabel>
            {t("calculator.results.averageElectricityGeneration")}
          </ItemResultLabel>
          <ItemResultValue>
            {results.averageElectricityGeneration}
          </ItemResultValue>
        </ItemResultWrapper>
        <Image
          src={ImageSolarFlash}
          alt="Solar Flash"
          className="block w-14 h-14"
        />
      </ItemResult>
    </Box>
  );
}
