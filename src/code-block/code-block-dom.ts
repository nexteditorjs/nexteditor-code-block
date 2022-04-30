import {
  addClass,
  assert,
  BlockElement,
  getBlockType, getLogger, NextEditor, removeClass,
} from '@nexteditorjs/nexteditor-core';
import { DocCodeBlockData } from './code-block-data';

const logger = getLogger('code-dom');

export function isCodeBlock(block: BlockElement) {
  return getBlockType(block) === 'code';
}

export function updateCodeBlockElementStyles(editor: NextEditor, block: BlockElement, codeData: DocCodeBlockData) {
  if (codeData.language) {
    block.setAttribute('data-language', codeData.language);
  } else {
    block.removeAttribute('data-language');
  }
  if (codeData.nowrap) {
    removeClass(block, 'wrap');
  } else {
    addClass(block, 'wrap');
  }
}

export function getParentCodeBlock(elem: Element) {
  //
  const codeBlock = elem.closest('div[data-type=editor-block][data-block-type=code]') as BlockElement;
  assert(logger, codeBlock, 'no parent code block');
  assert(logger, isCodeBlock(codeBlock), 'not a code block');
  return codeBlock;
  //
}
