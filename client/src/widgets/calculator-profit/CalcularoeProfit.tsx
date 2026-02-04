"use client";

import {
  EStationType,
  TCalculatorProfit,
  type EPageType,
  type TExchangeRates,
} from "@/src/features/global-params";
import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "@/src/shared/ui/title/SectionTitle";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";
import CalculatorResults from "./parts/CalculatorResults";
import CalculatorSettings from "./parts/CalculatorSettings";
import CalculatorSlider from "./parts/CalculatorSlider";
import type { TCalculatorForm } from "./types/calculator-form.type";

type Props = {
  data: TCalculatorProfit;
  exchangeRate: TExchangeRates;
  pageType: EPageType;
};

export default function CalculatorProfit({
  data,
  exchangeRate,
  pageType,
}: Props) {
  const exchangeRateUAH = exchangeRate.UAH;
  const t = useTranslations("common");

  const [costInstalledStation, setCostInstalledStation] = useState<
    string | null
  >(null);
  const [profitEntirePeriodOperation, setProfitEntirePeriodOperation] =
    useState<string | null>(null);
  const [paybackPeriodStation, setPaybackPeriodStation] = useState<
    string | null
  >(null);
  const [averageSavingsPerKw, setAverageSavingsPerKw] = useState<string | null>(
    null,
  );
  const [returnOnInvestment, setReturnOnInvestment] = useState<string | null>(
    null,
  );
  const [averageElectricityGeneration, setAverageElectricityGeneration] =
    useState<string | null>(null);

  const { register, control } = useForm<TCalculatorForm>({
    defaultValues: {
      stationType: EStationType.NETWORK,
      tariff: "4.3",
      operatingTime: "10",
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

  const calcFunctionDebounced = useDebouncedCallback(() => {
    if (
      !currentPower ||
      !stationTypeValue ||
      !tariffValue ||
      !operatingTimeValue
    )
      return;
    console.log("Calculation...");
    const ratePerKwCalc =
      data.range_rate_per_kwh[stationTypeValue].find(
        (r) => r.breakPoint >= currentPower,
      )?.rate ||
      data.range_rate_per_kwh[stationTypeValue][0]?.rate ||
      1; // Ставка за 1 кВт (копійки)

    const costInstalledStationResult = ratePerKwCalc * currentPower * 41; // Вартість встановленій станції (копійки) exchangeRateUAH

    const monthlyOutputOfStationForMonth =
      Math.round(23 * 4.270833333 * 1000 * currentPower) / 1000; // Середнії виробіток електроенергіг за допомогою СЕС за місяць

    const monthlyOutputOfStation = monthlyOutputOfStationForMonth * 12; // Середнії виробіток електроенергіг за допомогою СЕС за рік

    const costElectricityGenerated =
      monthlyOutputOfStation *
      Number(operatingTimeValue) *
      (Number(tariffValue) * 100); // Вартість електроенергії, яку згенерує станція на ринку за період експлуатації, (копійки)

    const profitEntirePeriodOperationResult =
      costElectricityGenerated - costInstalledStationResult; // Прибуток від станції за весь срок експлуатації (копійки)

    const paybackPeriodStationResult =
      costInstalledStationResult /
      (Number(tariffValue) * 100 * monthlyOutputOfStation); // Окупність станції (років)

    const averageSavingsPerKwResult =
      costInstalledStationResult /
      (Number(operatingTimeValue) * monthlyOutputOfStation); // Середня економія за 1 кВт (копійки)

    const returnOnInvestmentResult =
      profitEntirePeriodOperationResult /
      costInstalledStationResult /
      Number(operatingTimeValue); // Рентабельність інвестицій (%)

    setCostInstalledStation(
      (costInstalledStationResult / 100).toLocaleString("uk-UA", {
        style: "currency",
        currency: "UAH",
        maximumFractionDigits: 0,
      }),
    );
    setProfitEntirePeriodOperation(
      Math.round(profitEntirePeriodOperationResult / 100).toLocaleString(
        "uk-UA",
        {
          style: "currency",
          currency: "UAH",
          maximumFractionDigits: 0,
        },
      ),
    );
    setPaybackPeriodStation(
      paybackPeriodStationResult.toFixed(1) + " " + t("measurements.years"),
    );
    setAverageSavingsPerKw(
      (averageSavingsPerKwResult / 100).toLocaleString("uk-UA", {
        style: "currency",
        currency: "UAH",
      }),
    );
    setReturnOnInvestment(
      Math.round(returnOnInvestmentResult * 100).toString() + "%",
    );
    setAverageElectricityGeneration(
      monthlyOutputOfStationForMonth.toLocaleString("uk-UA", {}),
    );
  }, 1000);

  useEffect(() => {
    if (
      !currentPower ||
      !stationTypeValue ||
      !tariffValue ||
      !operatingTimeValue
    )
      return;

    calcFunctionDebounced();
  }, [
    currentPower,
    stationTypeValue,
    tariffValue,
    operatingTimeValue,
    calcFunctionDebounced,
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
            <CalculatorSettings registerAction={register} control={control} />
          </Box>
          <Box className="flex-1">
            <CalculatorResults
              results={{
                costInstalledStation: costInstalledStation ?? "0",
                profitEntirePeriodOperation: profitEntirePeriodOperation ?? "0",
                paybackPeriodStation: paybackPeriodStation ?? "0",
                averageSavingsPerKw: averageSavingsPerKw ?? "0",
                returnOnInvestment: returnOnInvestment ?? "0",
                averageElectricityGeneration:
                  averageElectricityGeneration ?? "0",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Section>
  );
}
