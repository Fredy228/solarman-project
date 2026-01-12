import IconFacebook from "@/src/shared/ui/icons/IconFacebook";
import IconInstagram from "@/src/shared/ui/icons/IconInstagram";
import IconTelegram from "@/src/shared/ui/icons/IconTelegram";
import { Box, Link as MUILink, Stack } from "@mui/material";

export default function SocialsLinks() {
  return (
    <Stack component={"ul"} direction="row" spacing={{ xs: 2, sm: 1 }}>
      <Box component={"li"}>
        <MUILink
          href="#"
          target="_blank"
          className="block fill-[#3b5998] hover:scale-[1.2] transition-(scale) duration-200"
        >
          <IconFacebook className="w-[25px] h-[25px] fill-inherit!" />
        </MUILink>
      </Box>
      <Box component={"li"}>
        <MUILink
          href="#"
          target="_blank"
          className="block fill-[#c13584] hover:scale-[1.2] transition-[scale] duration-200"
        >
          <IconInstagram className="w-[25px] h-[25px] fill-inherit!" />
        </MUILink>
      </Box>
      <Box component={"li"}>
        <MUILink
          href="#"
          target="_blank"
          className="block fill-[#40b3e0] hover:scale-[1.2] transition-[scale] duration-200"
        >
          <IconTelegram className="w-[25px] h-[25px] fill-inherit!" />
        </MUILink>
      </Box>
    </Stack>
  );
}
