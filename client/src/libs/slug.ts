export const generateSlug = (text: string): string => {
  const translitMap: { [key: string]: string } = {
    // Ukrainian
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh",
    з: "z", и: "y", і: "i", ї: "i", й: "y", к: "k", л: "l", м: "m", н: "n",
    о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
    ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia",
    // Russian
    ё: "yo", ъ: "", ы: "y", э: "e",
  };

  if (!text) {
    return "";
  }

  const baseSlug = text
    .toLowerCase()
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  const randomPart = Math.random().toString(36).substring(2, 8);

  return `${baseSlug}-${randomPart}`;
};
