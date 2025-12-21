export function extractImageUrls(blocks: any[]): string[] {
  let urls: string[] = [];

  if (!Array.isArray(blocks)) {
    return urls;
  }

  for (const block of blocks) {
    if (block.type === 'image' && block.props?.url) {
      urls.push(block.props.url);
    }

    if (block.children && block.children.length > 0) {
      const childrenUrls = extractImageUrls(block.children);
      urls = urls.concat(childrenUrls);
    }
  }

  return urls;
}
