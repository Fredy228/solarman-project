export const parseTextToHtml = (text: string) => {
  if (!text) return "";

  const html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/__(.*?)__/g, "<i>$1</i>");

  const blocks = html.split(/(\n\s*){2,}/);

  const processedBlocks = blocks
    .map((block) => {
      if (!block || !block.trim()) {
        return null;
      }

      if (block.includes("- ")) {
        const listItems = block
          .split("\n")
          .filter((line) => line.trim().startsWith("- "))
          .map((line) =>
            line.replace(
              /^- (.*)/,
              "<li style='margin-left: 20px; list-style: inside;'>$1</li>",
            ),
          )
          .join("");

        if (listItems) {
          return `<ul>${listItems}</ul>`;
        }
      }

      return `<p>${block.trim().replace(/\n/g, "<br />")}</p>`;
    })
    .filter(Boolean);

  return processedBlocks.join("\n");
};
