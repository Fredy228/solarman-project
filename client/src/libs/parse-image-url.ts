export const parseImageUrl = (url: string) => {
  try {
    const urlObj = new URL("http://localhost" + url);
    const pathname = urlObj.pathname;
    const width = urlObj.searchParams.get("w");
    const height = urlObj.searchParams.get("h");
    return {
      src: pathname,
      width: width ? parseInt(width, 10) : 800,
      height: height ? parseInt(height, 10) : 500,
    };
  } catch (e) {
    console.error("Error parsing image URL:", e);
    return { src: url, width: 800, height: 500 };
  }
};
