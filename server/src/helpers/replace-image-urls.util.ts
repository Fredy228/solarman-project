import { Block } from '@blocknote/core';

export function replaceImageUrls(
  blocks: Block[],
  urlMap: Record<string, string>,
): Block[] {
  if (!blocks || !Array.isArray(blocks)) {
    return [];
  }

  return blocks.map((block) => {
    const newBlock = {
      ...block,
      props: { ...block.props },
    } as Block;

    if (newBlock.type === 'image') {
      const props = newBlock.props as { url: string; [key: string]: any };

      if (props.url && urlMap[props.url]) {
        props.url = urlMap[props.url];
      }
    }

    if (newBlock.children && newBlock.children.length > 0) {
      newBlock.children = replaceImageUrls(newBlock.children, urlMap);
    }

    return newBlock;
  });
}
