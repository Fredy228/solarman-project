import { Block } from '@blocknote/core';

export function extractImageUrls(blocks: Block[]): string[] {
  let urls: string[] = [];

  if (!Array.isArray(blocks)) {
    return urls;
  }

  for (const block of blocks) {
    if (block.type === 'image') {
      const url = block.props['url'];
      if (typeof url === 'string') {
        urls.push(url);
      }
    }

    if (block.children && block.children.length > 0) {
      const childrenUrls = extractImageUrls(block.children);
      urls = urls.concat(childrenUrls);
    }
  }

  return urls;
}
