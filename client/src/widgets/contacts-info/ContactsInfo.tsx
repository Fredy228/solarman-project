import type { TContacts } from "@/src/features/global-params";
import type { ELocale } from "@/src/i18n/routing";
import { getLocalizedMapUrl } from "@/src/libs/getLocalizedMapUrl";
import Section from "@/src/shared/ui/sections/Section";
import { Box, Container, Link, Paper, Typography } from "@mui/material";
import { Mail, Map, Smartphone, ThumbsUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import SocialsLinks from "../socials-links/SocialsLinks";

type Props = {
  contactsData: TContacts | null;
};

export default function ContactsInfo({ contactsData }: Props) {
  const locale = useLocale() as ELocale;
  const t = useTranslations("contacts");

  const phoneFormatted = contactsData?.phone
    ? `+${contactsData.phone.slice(0, 2)}(${contactsData.phone.slice(2, 5)})-${contactsData.phone.slice(5, 8)}-${contactsData.phone.slice(8, 10)}-${contactsData.phone.slice(10, 12)}`
    : null;

  return (
    <>
      <Container maxWidth="xl" className="flex justify-end">
        <Box className="relative w-full mt-8 md:mt-0">
          <Box className="static md:absolute w-full md:w-[calc(50%-30px)] h-[400px] md:h-[450px] lg:h-[400px] md:right-0 md:top-[-200px] lg:top-[-200px] flex flex-col gap-2">
            <Box className="flex gap-2 items-center">
              <Box className="w-12 h-12 rounded-full flex justify-center items-center bg-(--color-secondary)">
                <Map color="var(--color-text-light)" size={25} />
              </Box>
              <Box className="flex-1">
                <Typography color={"var(--color-text-g2)"} fontWeight={700}>
                  {t("addressLabel")}
                </Typography>
                <Typography color={"var(--color-text-g3)"}>
                  {contactsData?.address[locale]}
                </Typography>
              </Box>
            </Box>
            <Paper
              elevation={3}
              className="flex-1 rounded-(--border-radius-main)"
            >
              <iframe
                src={
                  contactsData?.link_google_maps
                    ? getLocalizedMapUrl(contactsData.link_google_maps, locale)
                    : ""
                }
                loading="lazy"
                className="w-full h-full rounded-(--border-radius-main)"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Paper>
          </Box>
        </Box>
      </Container>
      <Section>
        <Container maxWidth="xl" className="flex justify-start">
          <Box
            component={"ul"}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 pt-5 pb-5"
          >
            <Box component={"li"} className="flex gap-2 items-center">
              <Box className="w-12 h-12 rounded-full flex justify-center items-center bg-(--color-secondary)">
                <Smartphone color="var(--color-text-light)" size={25} />
              </Box>
              <Box className="flex-1">
                <Typography color={"var(--color-text-g2)"} fontWeight={700}>
                  {t("phoneLabel")}
                </Typography>
                <Link
                  sx={{
                    color: "var(--color-text-g3)",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  href={`tel:${contactsData?.phone}`}
                >
                  {phoneFormatted}
                </Link>
              </Box>
            </Box>
            <Box component={"li"} className="flex gap-2 items-center">
              <Box className="w-12 h-12 rounded-full flex justify-center items-center bg-(--color-secondary)">
                <Mail color="var(--color-text-light)" size={25} />
              </Box>
              <Box className="flex-1">
                <Typography color={"var(--color-text-g2)"} fontWeight={700}>
                  {t("emailLabel")}
                </Typography>
                <Link
                  sx={{
                    color: "var(--color-text-g3)",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  href={`mailto:${contactsData?.email}`}
                >
                  {contactsData?.email}
                </Link>
              </Box>
            </Box>
            <Box component={"li"} className="flex gap-2 items-center">
              <Box className="w-12 h-12 rounded-full flex justify-center items-center bg-(--color-secondary)">
                <ThumbsUp color="var(--color-text-light)" size={25} />
              </Box>
              <Box className="flex-1">
                <Typography color={"var(--color-text-g2)"} fontWeight={700}>
                  {t("socialMediaLabel")}
                </Typography>
                {contactsData && <SocialsLinks contactsData={contactsData} />}
              </Box>
            </Box>
          </Box>
        </Container>
      </Section>
    </>
  );
}
