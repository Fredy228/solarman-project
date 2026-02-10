"use client";

import {
  EStationType,
  TCalculatorProfit,
  type EPageType,
  type TExchangeRates,
} from "@/src/features/global-params";
import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "@/src/shared/ui/title/SectionTitle";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import CalculatorResults from "./parts/CalculatorResults";
import CalculatorSettings from "./parts/CalculatorSettings";
import CalculatorSlider from "./parts/CalculatorSlider";
import {
  calcAverageSavingsPerKw,
  calcCostElectricityGenerated,
  calcCostInstalledStation,
  calcInvestmentProfitabilityPerYear,
  calcMonthlyOutputOfStation,
  calcPaybackPeriodStation,
  calcProfitEntirePeriodOperation,
  calcYearlyOutputOfStation,
} from "./parts/formulas";
import type { TCalculatorForm } from "./types/calculator-form.type";

type Props = {
  data: TCalculatorProfit;
  exchangeRate: TExchangeRates;
  pageType: EPageType;
  defaultTariff?: number;
  defaultOperatingTime?: number;
};

export default function CalculatorProfit({
  data,
  exchangeRate,
  pageType,
  defaultOperatingTime = 15,
  defaultTariff = 4.32,
}: Props) {
  const exchangeRateUAH = exchangeRate.UAH;
  const t = useTranslations("common");

  const { control } = useForm<TCalculatorForm>({
    defaultValues: {
      stationType: EStationType.NETWORK,
      tariff: String(defaultTariff),
      operatingTime: String(defaultOperatingTime),
    },
  });

  const [currentPower, setCurrentPower] = useState<number | null>(null);

  const stationTypeValue = useWatch({
    control,
    name: "stationType",
  });
  const tariffValue = useWatch({
    control,
    name: "tariff",
  });
  const operatingTimeValue = useWatch({
    control,
    name: "operatingTime",
  });

  // Хелпер для форматирования валюты (стабильный для SSR)
  const formatCurrency = (amount: number, decimals = 2) => {
    const formatted = amount.toLocaleString("uk-UA", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${formatted} ₴`;
  };

  // Основные вычисления калькулятора
  const calculatedResults = useMemo(() => {
    if (
      !currentPower ||
      !stationTypeValue ||
      !tariffValue ||
      !operatingTimeValue
    ) {
      return {
        costInstalledStation: "0",
        profitEntirePeriodOperation: "0",
        paybackPeriodStation: "0",
        averageSavingsPerKw: "0",
        returnOnInvestment: "0",
        averageElectricityGeneration: "0",
      };
    }

    // Ставка за 1 кВт (копійки)
    const ratePerKwCalc =
      [...data.range_rate_per_kwh[stationTypeValue]]
        .reverse()
        .find((r) => r.breakPoint <= currentPower)?.rate ||
      data.range_rate_per_kwh[stationTypeValue][0]?.rate ||
      1;

    // Вартість встановленої станції (копійки)
    const costInstalledStationResult = calcCostInstalledStation(
      ratePerKwCalc * exchangeRateUAH,
      currentPower,
    );

    // Середній виробіток електроенергії за допомогою СЕС за місяць
    const monthlyOutputOfStation = calcMonthlyOutputOfStation(currentPower);

    // Середній виробіток електроенергії за допомогою СЕС за рік
    const yearlyOutputOfStation = calcYearlyOutputOfStation(
      monthlyOutputOfStation,
    );

    // Вартість електроенергії, яку згенерує станція на ринку за період експлуатації (копійки)
    const costElectricityGenerated = calcCostElectricityGenerated(
      Number(tariffValue) * 100,
      Number(operatingTimeValue),
      yearlyOutputOfStation,
    );

    // Прибуток від станції за весь строк експлуатації (копійки)
    const profitEntirePeriodOperationResult = calcProfitEntirePeriodOperation(
      costElectricityGenerated,
      costInstalledStationResult,
    );

    // Окупність станції (років)
    const paybackPeriodStationResult = calcPaybackPeriodStation(
      costInstalledStationResult,
      Number(tariffValue) * 100,
      yearlyOutputOfStation,
    );

    // Середня економія за 1 кВт (копійки)
    const averageSavingsPerKwResult = calcAverageSavingsPerKw(
      costInstalledStationResult,
      Number(operatingTimeValue),
      yearlyOutputOfStation,
      Number(tariffValue) * 100,
    );

    // Рентабельність інвестицій (%) за 1 рік
    const investmentProfitabilityPerYearResult =
      calcInvestmentProfitabilityPerYear(
        profitEntirePeriodOperationResult,
        costInstalledStationResult,
        Number(operatingTimeValue),
      );

    return {
      costInstalledStation: formatCurrency(costInstalledStationResult / 100, 0),
      profitEntirePeriodOperation: formatCurrency(
        Math.round(profitEntirePeriodOperationResult / 100),
        0,
      ),
      paybackPeriodStation:
        paybackPeriodStationResult.toFixed(1) + " " + t("measurements.years"),
      averageSavingsPerKw: formatCurrency(averageSavingsPerKwResult / 100),
      returnOnInvestment:
        Math.round(investmentProfitabilityPerYearResult).toString() + "%",
      averageElectricityGeneration:
        monthlyOutputOfStation.toLocaleString("uk-UA"),
    };
  }, [
    currentPower,
    stationTypeValue,
    tariffValue,
    operatingTimeValue,
    data.range_rate_per_kwh,
    exchangeRateUAH,
    t,
  ]);

  return (
    <Section>
      <Container maxWidth="xl">
        <SectionTitle className="text-center" mb={2}>
          {t("calculator.title")}
        </SectionTitle>
        <Typography
          component={"p"}
          variant="subtitle1"
          textAlign={"center"}
          mb={1}
        >
          {t("calculator.description")}
        </Typography>
        <CalculatorSlider
          data={data}
          stationType={stationTypeValue}
          pageType={pageType}
          onChangePower={setCurrentPower}
        />
        <Box className="flex mt-8 gap-6 flex-col md:flex-row md:items-center">
          <Box className="w-full md:w-[320px]">
            <CalculatorSettings control={control} />
          </Box>
          <Box className="flex-1">
            <CalculatorResults results={calculatedResults} />
          </Box>
        </Box>
      </Container>
    </Section>
  );
}
