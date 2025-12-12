"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useState } from "react";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";

interface PortfolioDescriptionProps {
  description: LocalizedContent;
  locale: string;
}

export default function BlockNoteView({
  description,
  locale,
}: PortfolioDescriptionProps) {
  const editor = useCreateBlockNote();
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    async function parseDescription() {
      const contentJson = description?.[locale as keyof LocalizedContent];

      if (contentJson) {
        try {
          const parsedJson = JSON.parse(contentJson);
          const html = editor.blocksToHTMLLossy(parsedJson);
          setHtmlContent(html);
        } catch (e) {
          console.error("Error parsing blocknote content:", e);
        }
      }
    }
    parseDescription();
  }, [description, locale, editor]);

  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
