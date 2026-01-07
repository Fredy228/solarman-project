"use client";

import { ukUA as coreBgUkUA, ruRU as coreRuRU } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";
import {
  ruRU as dataGridRuRU,
  ukUA as dataGridUkUA,
} from "@mui/x-data-grid/locales";
import {
  ruRU as pickersRuRU,
  ukUA as pickersUkUA,
} from "@mui/x-date-pickers/locales";

import { ELocale } from "../i18n/routing";

const translateMui = (locale?: string) => {
  switch (locale) {
    case ELocale.UK:
      return [dataGridUkUA, pickersUkUA, coreBgUkUA];
    case ELocale.RU:
      return [dataGridRuRU, pickersRuRU, coreRuRU];
    default:
      return [dataGridUkUA, pickersUkUA, coreBgUkUA];
  }
};

export const theme = (lang?: ELocale) =>
  createTheme(
    {
      cssVariables: true,
      palette: {
        mode: "light",
        primary: {
          main: "#fc7300",
        },
        secondary: {
          main: "#16498a",
        },
      },
      typography: {
        fontFamily: "var(--font-montserrat)",
        fontWeightRegular: "var(--font-weight-default)",
        h1: {
          textTransform: "uppercase",
          fontWeight: 700,
          fontSize: "40px",
          color: "var(--color-secondary)",
          lineHeight: 1.3,
          zIndex: 20,
        },
        h2: {
          textTransform: "uppercase",
          fontWeight: 700,
          fontSize: "30px",
          color: "var(--color-secondary)",
          lineHeight: 1.3,
        },
        subtitle1: {
          fontSize: "18px",
          color: "var(--color-text-g2)",
          lineHeight: 1.5,
          zIndex: 20,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: "9999px",
              textTransform: "none",
              fontSize: "16px",
            },
            contained: {
              color: "var(--color-text-light)",
            },
          },
        },
      },
    },
    ...translateMui(lang)
  );
