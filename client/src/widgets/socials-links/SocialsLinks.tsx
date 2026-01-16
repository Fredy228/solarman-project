import type { TContacts } from "@/src/features/global-params";
import IconFacebook from "@/src/shared/ui/icons/IconFacebook";
import IconInstagram from "@/src/shared/ui/icons/IconInstagram";
import IconTelegram from "@/src/shared/ui/icons/IconTelegram";
import IconYoutube from "@/src/shared/ui/icons/IconYoutube";
import { Box, Link as MUILink, Stack } from "@mui/material";

type Props = {
  contactsData: TContacts;
};

export default function SocialsLinks({ contactsData }: Props) {
  return (
    <Stack component={"ul"} direction="row" spacing={{ xs: 2, sm: 1 }}>
      {contactsData.link_facebook && (
        <Box component={"li"}>
          <MUILink
            href={contactsData.link_facebook}
            target="_blank"
            className="block fill-[#3b5998] hover:scale-[1.2] transition-(scale) duration-200"
          >
            <IconFacebook className="w-[25px] h-[25px] fill-inherit!" />
          </MUILink>
        </Box>
      )}

      {contactsData.link_instagram && (
        <Box component={"li"}>
          <MUILink
            href={contactsData.link_instagram}
            target="_blank"
            className="block fill-[#c13584] hover:scale-[1.2] transition-[scale] duration-200"
          >
            <IconInstagram className="w-[25px] h-[25px] fill-inherit!" />
          </MUILink>
        </Box>
      )}

      {contactsData.link_telegram && (
        <Box component={"li"}>
          <MUILink
            href={contactsData.link_telegram}
            target="_blank"
            className="block fill-[#40b3e0] hover:scale-[1.2] transition-[scale] duration-200"
          >
            <IconTelegram className="w-[25px] h-[25px] fill-inherit!" />
          </MUILink>
        </Box>
      )}

      {contactsData.link_youtube && (
        <Box component={"li"}>
          <MUILink
            href={contactsData.link_youtube}
            target="_blank"
            className="block fill-[#ea333e] hover:scale-[1.2] transition-[scale] duration-200"
          >
            <IconYoutube
              sx={{
                color: "#ea333e",
              }}
              className="w-[25px] h-[25px] color-inherit! fill-inherit!"
            />
          </MUILink>
        </Box>
      )}
    </Stack>
  );
}
