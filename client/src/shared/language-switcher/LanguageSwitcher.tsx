"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;

    const currentParams = searchParams.toString();
    const path = currentParams ? `${pathname}?${currentParams}` : pathname;

    router.replace(path, { locale: newLocale });
  };

  return (
    <FormControl size="small" variant="outlined">
      <Select
        value={locale}
        onChange={handleChange}
        sx={{
          color: "inherit",
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .MuiSelect-icon": { color: "inherit" },
        }}
        inputProps={{ "aria-label": "Switch language" }}
      >
        <MenuItem value="uk">UK</MenuItem>
        <MenuItem value="ru">RU</MenuItem>
      </Select>
    </FormControl>
  );
};
