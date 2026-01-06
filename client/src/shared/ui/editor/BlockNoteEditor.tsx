"use client";

import {
  Block,
  BlockNoteSchema,
  defaultBlockSpecs,
  PartialBlock,
} from "@blocknote/core";
import { ru, uk } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { Box, Typography, useTheme } from "@mui/material";
import { useLocale } from "next-intl";
import { type FC, useEffect } from "react";

import "@blocknote/mantine/style.css";

import { ELocale } from "@/src/i18n/routing";
import apiClient from "@/src/libs/api-client";

const { video, audio, file, ...filteredBlockSpecs } = defaultBlockSpecs;
// const { image, video, audio, file, ...filteredBlockSpecs } = defaultBlockSpecs;

const schema = BlockNoteSchema.create({
  blockSpecs: filteredBlockSpecs,
});

type BlockNoteEditorProps = {
  onChange: (value: Block[]) => void;
  initialContent?: PartialBlock[];
  editable?: boolean;
  label?: string;
  disabledImage?: boolean;
};

const translateEditor = (locale: string) => {
  switch (locale) {
    case ELocale.UK:
      return uk;
    case ELocale.RU:
      return ru;
    default:
      return uk;
  }
};

const BlockNoteEditor: FC<BlockNoteEditorProps> = (props) => {
  const { onChange, initialContent, editable, label } = props;
  const theme = useTheme();
  const locale = useLocale();

  const editor = useCreateBlockNote({
    schema,
    dictionary: translateEditor(locale),
    uploadFile: async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const { data } = await apiClient
          .getInstance()
          .post("/upload/image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        return data.url;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to upload file");
      }
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      const content = editor.document[0]?.content;
      const isPristine =
        editor.document.length <= 1 &&
        (!content || (Array.isArray(content) && content.length === 0));

      if (isPristine) {
        editor.replaceBlocks(editor.document, initialContent as any);
      }
    }
  }, [editor, initialContent]);

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
        theme="light"
        onChange={(editor) => onChange(editor.document)}
      />
    </Box>
  );
};

export default BlockNoteEditor;
