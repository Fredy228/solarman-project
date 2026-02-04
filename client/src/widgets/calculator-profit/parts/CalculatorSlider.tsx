import {
  EStationType,
  TCalculatorProfit,
  type EPageType,
} from "@/src/features/global-params";
import { Box, Slider, styled } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const CustomSlider = styled(Slider)(({ theme }) => ({
  height: 10,
  "& .MuiSlider-thumb": {
    height: 40,
    width: 40,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    border: "none",
    "&:before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28' fill='%23ffffff'%3E%3Cpath d='M15.821 1.465c0.583 0.184 0.979 0.724 0.979 1.335v7h5.6c0.522 0 1.001 0.29 1.242 0.753s0.205 1.022-0.095 1.449l-9.8 14c-0.35 0.5-0.985 0.716-1.568 0.532s-0.979-0.724-0.979-1.335v-7h-5.6c-0.522 0-1.001-0.29-1.242-0.753s-0.205-1.022 0.095-1.449l9.8-14c0.35-0.501 0.985-0.716 1.568-0.532z'%3E%3C/path%3E%3C/svg%3E\")",
      backgroundSize: "60%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  },
  "& .MuiSlider-track": {
    height: 10,
  },
  "& .MuiSlider-rail": {
    height: 10,
    opacity: 0.5,
  },
  "& .MuiSlider-markLabel": {
    top: "calc(100% + 12px)",
  },
  "& .MuiSlider-valueLabel": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    borderRadius: "10px",
    padding: "4px 8px",
    "&:before": {
      borderTopColor: theme.palette.primary.main,
    },
  },
}));

type Props = {
  data: TCalculatorProfit;
  stationType: EStationType;
  pageType: EPageType;
  onChangePower?: (power: number) => void;
};

export default function CalculatorSlider({
  data,
  stationType,
  pageType,
  onChangePower,
}: Props) {
  // Генерируем массив всех возможных значений
  const powerValues = useMemo(() => {
    const minMax = data.min_max_range_power[pageType][stationType];
    const ranges = data.range_power[stationType];

    // Сортируем ranges по breakPoint для корректной работы
    const sortedRanges = [...ranges].sort(
      (a, b) => a.breakPoint - b.breakPoint,
    );

    const values: number[] = [];
    let currentValue = minMax.min;

    while (currentValue <= minMax.max) {
      values.push(currentValue);

      // Находим подходящий шаг для текущего значения
      // Ищем последний диапазон, где breakPoint <= currentValue
      let step = 1; // шаг по умолчанию, если значение меньше первого breakPoint

      for (let i = sortedRanges.length - 1; i >= 0; i--) {
        if (currentValue >= sortedRanges[i].breakPoint) {
          step = sortedRanges[i].step;
          break;
        }
      }

      currentValue += step;
    }

    // Убедимся, что максимальное значение включено
    if (values[values.length - 1] !== minMax.max) {
      values.push(minMax.max);
    }

    return values;
  }, [data, stationType]);

  // Состояние слайдера - работаем с индексами
  const [sliderIndex, setSliderIndex] = useState(0);

  // Получаем реальное значение из индекса
  const currentPower = powerValues[sliderIndex];

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const idx = newValue as number;
    setSliderIndex(idx);
    const power = powerValues[idx];
    onChangePower?.(power);
  };

  // emit initial value and when ranges or index change
  useEffect(() => {
    if (powerValues.length === 0) return;
    onChangePower?.(powerValues[sliderIndex]);
  }, [powerValues, sliderIndex, onChangePower]);

  return (
    <Box className="max-w-[900px] mx-auto px-4 pt-11">
      <CustomSlider
        value={sliderIndex}
        min={0}
        max={powerValues.length - 1}
        step={1}
        onChange={handleSliderChange}
        marks={powerValues.map((value, index) => ({
          value: index,
          label: index % 5 === 0 ? `${value}` : "",
        }))}
        valueLabelDisplay="on"
        valueLabelFormat={(index) => `${powerValues[index]} кВт`}
      />
    </Box>
  );
}
