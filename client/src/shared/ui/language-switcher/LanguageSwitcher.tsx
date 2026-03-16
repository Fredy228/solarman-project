"use client";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

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
        MenuProps={{
          PaperProps: {
            sx: { borderRadius: "10px" },
          },
        }}
        inputProps={{ "aria-label": "Switch language" }}
      >
        <MenuItem value="uk">UK</MenuItem>
        <MenuItem value="ru">RU</MenuItem>
      </Select>
    </FormControl>
  );
};
