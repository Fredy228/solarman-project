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
};

export default function HeaderContacts({ isMobile }: Props) {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const stackProps: StackProps = isMobile
    ? { direction: "column", spacing: 1, mt: 1 }
    : { direction: "row", spacing: 1, alignItems: "center" };

  return (
    <Stack {...stackProps}>
      <MUILink
        href="mailto:info@example.com"
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
        {isMobile && <span>info@example.com</span>}
      </MUILink>
      <MUILink
        href="tel:+1234567890"
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
        {(isMobile || isLgUp) && <span>+1 (234) 567-890</span>}
      </MUILink>
    </Stack>
  );
}
