import type { TContacts } from "@/src/features/global-params";
import IconLogoFooter from "@/src/shared/ui/icons/IconLogoFooter";
import { Box, Container, Link as MUILink, Typography } from "@mui/material";
import { Smartphone } from "lucide-react";
import SocialsLinks from "../socials-links/SocialsLinks";

const getCurrentYear = () => {
  const now = new Date();
  return now.getFullYear();
};

type Props = {
  contactsData: TContacts | null;
};

export default function Footer({ contactsData }: Props) {
  return (
    <Box component={"footer"} className="pt-5 pb-5">
      <Container maxWidth="xl">
        <Box className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center">
          <Box className="flex items-center justify-between gap-4 sm:justify-start">
            <IconLogoFooter
              color="secondary"
              sx={{ width: "100px", height: "auto" }}
            />
            <Typography
              component={"span"}
              color="var(--color-text-g4)"
              fontSize={12}
            >
              {getCurrentYear()} © Solar Man
            </Typography>
          </Box>
          {contactsData && (
            <Box className="flex flex-row justify-between items-center sm:justify-start gap-4">
              <MUILink
                href={`tel:${contactsData.phone}`}
                underline="none"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "var(--color-text-g3)",
                  gap: 1,
                  "&:hover": { color: "var(--color-primary)" },
                  transition: "color 200ms",
                }}
              >
                <Smartphone color="var(--color-primary)" />
                <span>{contactsData.phone}</span>
              </MUILink>
              <SocialsLinks contactsData={contactsData} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
