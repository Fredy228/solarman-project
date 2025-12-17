"use client";

import { createTheme } from "@mui/material/styles";
import { ukUA as coreBgUkUA, ruRU as coreRuRU } from "@mui/material/locale";
import {
  ukUA as pickersUkUA,
  ruRU as pickersRuRU,
} from "@mui/x-date-pickers/locales";
import {
  ukUA as dataGridUkUA,
  ruRU as dataGridRuRU,
} from "@mui/x-data-grid/locales";

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

export const theme = (lang?: ELocale) => createTheme({}, ...translateMui(lang));
