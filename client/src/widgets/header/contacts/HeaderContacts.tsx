import type { TContacts } from "@/src/features/global-params";
import {
  Link as MUILink,
  Stack,
  useMediaQuery,
  useTheme,
  type StackProps,
} from "@mui/material";
import { Mail, Smartphone } from "lucide-react";

type Props = {
  isMobile?: boolean;
  contactsData: TContacts;
};

export default function HeaderContacts({ isMobile, contactsData }: Props) {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const stackProps: StackProps = isMobile
    ? { direction: "column", spacing: 1, mt: 1 }
    : { direction: "row", spacing: 1, alignItems: "center" };

  const phoneFormatted =
    contactsData.phone.length === 12
      ? `+${contactsData.phone.slice(0, 2)}(${contactsData.phone.slice(2, 5)})-${contactsData.phone.slice(5, 8)}-${contactsData.phone.slice(8, 10)}-${contactsData.phone.slice(10, 12)}`
      : contactsData.phone;

  return (
    <Stack {...stackProps}>
      <MUILink
        href={`mailto:${contactsData.email}`}
        underline="none"
        color="inherit"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "var(--color-text-g3)",
          "&:hover": { color: "var(--color-primary)" },
          transition: theme.transitions.create(["color"], {
            duration: theme.transitions.duration.shortest,
          }),
        }}
      >
        <Mail />
        {isMobile && <span>{contactsData.email}</span>}
      </MUILink>
      <MUILink
        href={`tel:+${contactsData.phone}`}
        underline="none"
        color="inherit"
        sx={{
          display: "flex",
          alignItems: "center",
          color: "var(--color-text-g3)",
          gap: 1,
          "&:hover": { color: "var(--color-primary)" },
          transition: theme.transitions.create(["color"], {
            duration: theme.transitions.duration.shortest,
          }),
        }}
      >
        <Smartphone />
        {(isMobile || isLgUp) && <span>{phoneFormatted}</span>}
      </MUILink>
    </Stack>
  );
}
