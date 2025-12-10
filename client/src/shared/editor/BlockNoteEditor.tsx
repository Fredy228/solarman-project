"use client";

import {
  Block,
  BlockNoteSchema,
  defaultBlockSpecs,
  PartialBlock,
} from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { type FC } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import "@blocknote/mantine/style.css";

const { image, video, audio, file, ...filteredBlockSpecs } = defaultBlockSpecs;

const schema = BlockNoteSchema.create({
  blockSpecs: filteredBlockSpecs,
});

type BlockNoteEditorProps = {
  onChange: (value: Block[]) => void;
  initialContent?: PartialBlock[];
  editable?: boolean;
  label?: string;
};

const BlockNoteEditor: FC<BlockNoteEditorProps> = (props) => {
  const { onChange, initialContent, editable, label } = props;
  const theme = useTheme();

  const editor = useCreateBlockNote({
    initialContent: initialContent,
    schema,
  });

  return (
    <Box
      className={"min-h-[250px] w-full p-2"}
      sx={{
        position: "relative",
        borderRadius: "4px",
        border: "1px solid",
        mt: 1,

        borderColor: (theme) =>
          theme.palette.mode === "light"
            ? "rgba(0, 0, 0, 0.23)"
            : "rgba(255, 255, 255, 0.23)",

        "&:hover": {
          borderColor: "text.primary",
        },

        "&:focus-within": {
          borderColor: "primary.main",
          boxShadow: `inset 0 0 0 1px ${theme.palette.primary.main}`,

          "& .custom-label": {
            color: "primary.main",
          },
        },
        p: "16.5px 14px",
      }}
    >
      {label && (
        <Typography
          className="custom-label"
          component="label"
          variant="caption"
          sx={{
            position: "absolute",
            top: "-9px",
            left: "10px",
            backgroundColor: "background.paper",
            padding: "0 4px",
            color: "text.secondary",
            fontSize: "0.75rem",
            fontWeight: 400,
            lineHeight: 1,
            transition: "color 0.2s",
          }}
        >
          {label}
        </Typography>
      )}

      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={(editor) => onChange(editor.document)}
      />
    </Box>
  );
};

export default BlockNoteEditor;
