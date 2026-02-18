"use client";

import { Box, Chip } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import type { IHashtag } from "@/src/features/hashtag";
import type { LocalizedContent } from "@/src/shared/types/localized-content.type";

type Props = {
  hashtags: IHashtag[];
  clearLabel?: string;
  paramName?: string;
};

const getHashtagLabel = (hashtag: IHashtag, locale: string): string => {
  if (typeof hashtag.name === "string") {
    return hashtag.name;
  }

  const localized = hashtag.name as LocalizedContent;
  return (
    localized[locale as keyof LocalizedContent] || hashtag.tag || hashtag.id
  );
};

export default function HashtagChips({
  hashtags,
  paramName = "hashtag",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("common");

  const activeTags = useMemo(
    () => searchParams.getAll(paramName).filter(Boolean),
    [paramName, searchParams],
  );
  const maxVisible = 6;
  const [manualShowAll, setManualShowAll] = useState<boolean | null>(null);
  const activeIndex = useMemo(
    () => hashtags.findIndex((hashtag) => activeTags.includes(hashtag.tag)),
    [activeTags, hashtags],
  );
  const autoShowAll = activeIndex >= maxVisible;
  const showAll = manualShowAll ?? autoShowAll;

  const visibleHashtags = useMemo(
    () => (showAll ? hashtags : hashtags.slice(0, maxVisible)),
    [hashtags, maxVisible, showAll],
  );

  const buildHref = (nextParams: URLSearchParams) => {
    const query = nextParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const setParam = (value?: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value) {
      const existing = nextParams.getAll(paramName);
      const hasValue = existing.includes(value);

      nextParams.delete(paramName);
      const nextValues = hasValue
        ? existing.filter((item) => item !== value)
        : [...existing, value];

      nextValues.forEach((item) => nextParams.append(paramName, item));
    } else {
      nextParams.delete(paramName);
    }

    router.push(buildHref(nextParams));
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }} margin={"15px 0"}>
      <Chip
        label={t("button.All")}
        variant={activeTags.length === 0 ? "filled" : "outlined"}
        color={activeTags.length === 0 ? "primary" : "default"}
        onClick={() => setParam(undefined)}
        sx={{
          "& .MuiChip-label": {
            color:
              activeTags.length === 0 ? "var(--color-text-light)" : undefined,
          },
        }}
      />

      {visibleHashtags.map((hashtag) => {
        const isActive = activeTags.includes(hashtag.tag);
        return (
          <Chip
            key={hashtag.tag}
            label={getHashtagLabel(hashtag, locale)}
            variant={isActive ? "filled" : "outlined"}
            color={isActive ? "primary" : "default"}
            onClick={() => setParam(hashtag.tag)}
            sx={{
              "& .MuiChip-label": {
                color: isActive ? "var(--color-text-light)" : undefined,
              },
            }}
          />
        );
      })}

      {hashtags.length > maxVisible && (
        <Chip
          label={showAll ? t("button.hide") : t("button.more")}
          variant="filled"
          onClick={() => setManualShowAll((prev) => !(prev ?? autoShowAll))}
          color={"secondary"}
          sx={{
            "& .MuiChip-label": {
              color: "var(--color-text-light)",
            },
          }}
        />
      )}
    </Box>
  );
}
