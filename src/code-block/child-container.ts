import {
  assert, BlockElement,
  ContainerElement, getBlockContent, getBlockType, getLogger, getParentBlock, getParentContainer,
} from '@nexteditorjs/nexteditor-core';
import { isCodeBlock } from './code-block-dom';

const logger = getLogger('code-block-child-container');

export function getTextContainer(codeBlock: BlockElement): ContainerElement {
  assert(logger, isCodeBlock(codeBlock), 'not a code block');
  const content = getBlockContent(codeBlock);
  const textContainer = content.querySelector(':scope > div.editor-code-root > div.code-text-root [data-type=editor-container].child') as ContainerElement;
  assert(logger, textContainer, 'no code text container');
  return textContainer as ContainerElement;
}

export function getCaptionContainer(codeBlock: BlockElement): ContainerElement | null {
  assert(logger, isCodeBlock(codeBlock), 'not a code block');
  const content = getBlockContent(codeBlock);
  const textContainer = content.querySelector(':scope > div.editor-code-root > div.code-caption-root [data-type=editor-container].child') as ContainerElement;
  if (!textContainer) return null;
  return textContainer as ContainerElement;
}

export function getCodeChildContainers(codeBlock: BlockElement) {
  const containers = [getTextContainer(codeBlock)];
  const caption = getCaptionContainer(codeBlock);
  if (caption) {
    containers.push(caption);
  }
  return containers;
}

export function isCodeTextBlock(block: BlockElement) {
  const container = getParentContainer(block);
  const parentBlock = getParentBlock(container);
  if (!parentBlock) {
    return false;
  }
  if (isCodeBlock(parentBlock)) {
    return container === getTextContainer(parentBlock);
  }
  return getBlockType(block) === 'code';
}
