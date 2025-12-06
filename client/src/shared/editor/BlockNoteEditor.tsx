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
import { Box } from "@mui/material";

import "@blocknote/mantine/style.css";

const { image, video, audio, file, ...filteredBlockSpecs } = defaultBlockSpecs;

const schema = BlockNoteSchema.create({
  blockSpecs: filteredBlockSpecs,
});

type BlockNoteEditorProps = {
  onChange: (value: Block[]) => void;
  initialContent?: PartialBlock[];
  editable?: boolean;
};

const BlockNoteEditor: FC<BlockNoteEditorProps> = (props) => {
  const { onChange, initialContent, editable } = props;

  const editor = useCreateBlockNote({
    initialContent: initialContent,
    schema,
  });

  return (
    <Box
      className={"min-h-[250px] w-full p-2"}
      sx={{ border: "1px solid #000" }}
    >
      <BlockNoteView
        editor={editor}
        editable={editable}
        onChange={(editor) => onChange(editor.document)}
      />
    </Box>
  );
};

export default BlockNoteEditor;
