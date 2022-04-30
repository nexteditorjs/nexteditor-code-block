import {
  addClass,
  BlockElement,
  getBlockType, NextEditor, removeClass,
} from '@nexteditorjs/nexteditor-core';
import { DocCodeBlockData } from './code-block-data';

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
