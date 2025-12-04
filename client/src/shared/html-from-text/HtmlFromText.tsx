import { Box } from "@mui/material";
import { type FC } from "react";

import { parseTextToHtml } from "@/src/libs/parse-text-to-html";

type HtmlFromTextProps = {
  text: string;
};

export const HtmlFromText: FC<HtmlFromTextProps> = ({ text }) => {
  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        p: 2,
        backgroundColor: "#fafafa",
      }}
      dangerouslySetInnerHTML={{
        __html: parseTextToHtml(text),
      }}
    />
  );
};
