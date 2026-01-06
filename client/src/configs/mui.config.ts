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

import { themeConfig } from "@/src/configs/theme.config";
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
          main: themeConfig.colors.primary.main,
        },
        secondary: {
          main: themeConfig.colors.secondary.main,
        },
      },
      typography: {
        fontFamily: `${themeConfig.fonts.fontFamily}, sans-serif`,
        fontWeightRegular: themeConfig.styles.fontWeight,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: "9999px",
              textTransform: "none",
            },
            contained: {
              color: themeConfig.colors.light.text.light,
            },
          },
        },
      },
    },
    ...translateMui(lang)
  );
