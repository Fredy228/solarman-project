const collectText = (value: unknown, parts: string[]) => {
  if (typeof value === "string") {
    parts.push(value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectText(item, parts));
    return;
  }

  if (!value || typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  collectText(record.text, parts);
  collectText(record.content, parts);
  collectText(record.children, parts);
};

export function toPlainText(value: string | null | undefined): string {
  if (!value) return "";

  try {
    const parts: string[] = [];
    collectText(JSON.parse(value), parts);
    return parts.join(" ").replace(/\s+/g, " ").trim();
  } catch {
    return value
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}

export function truncateText(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 80 ? lastSpace : maxLength).trim()}...`;
}
