import type { StaticImageData } from "next/image";

import imageTeamAnatoliy from "@/src/assets/team/team-anatoliy.png";
import imageTeamMax from "@/src/assets/team/team-max.png";
import imageTeamPavlo from "@/src/assets/team/team-pavlo.png";
import type { TranslatorType } from "@/src/i18n/types";

type TeamItemType = {
  id: number;
  name: string;
  position: string;
  photoSrc: StaticImageData;
  ico: string;
};

export const listTeam = (t: TranslatorType): Array<TeamItemType> => [
  {
    id: 1,
    name: t("team.team.item1.name"),
    position: t("team.team.item1.position"),
    photoSrc: imageTeamAnatoliy,
    ico: "Brain",
  },
  {
    id: 2,
    name: t("team.team.item2.name"),
    position: t("team.team.item2.position"),
    photoSrc: imageTeamPavlo,
    ico: "Heart",
  },
  {
    id: 3,
    name: t("team.team.item3.name"),
    position: t("team.team.item3.position"),
    photoSrc: imageTeamMax,
    ico: "BicepsFlexed",
  },
];
