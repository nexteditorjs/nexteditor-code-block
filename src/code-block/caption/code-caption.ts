import {
  assert, BlockElement, createEmptyContainer, getBlockTextLength,
  getFirstChildBlock, getLastChildBlock, getLogger,
  getParentBlock,
  getParentContainer, isRootContainer, NextEditor,
} from '@nexteditorjs/nexteditor-core';
import { getCaptionContainer, getTextContainer } from '../child-container';
import { DocCodeBlockData } from '../code-block-data';
import { isCodeBlock } from '../code-block-dom';

const logger = getLogger('code-caption');

export function toggleCodeCaption(editor: NextEditor, codeBlock: BlockElement) {
  if (editor.readonly) {
    return;
  }
  const captionContainer = getCaptionContainer(codeBlock);
  if (captionContainer) {
    const firstBlock = getFirstChildBlock(captionContainer);
    editor.selection.selectBlock(firstBlock, 0);
    return;
  }
  //
  const captionContainerId = createEmptyContainer(editor.doc);
  const oldData = editor.getBlockData(codeBlock) as DocCodeBlockData;
  assert(logger, oldData.children.length === 1, 'code block should have only one child');
  const newData = {
    ...oldData,
    children: [oldData.children[0], captionContainerId],
  };
  editor.updateBlockData(codeBlock, newData);
  const newContainer = editor.getContainerById(captionContainerId);
  const firstBlock = getFirstChildBlock(newContainer);
  editor.selection.selectBlock(firstBlock, 0);
}

export function isCodeCaptionBlock(editor: NextEditor, block: BlockElement) {
  const parentContainer = getParentContainer(block);
  if (isRootContainer(parentContainer)) {
    return false;
  }
  const parentBlock = getParentBlock(parentContainer);
  assert(logger, parentBlock, 'no parent block');
  if (!isCodeBlock(parentBlock)) {
    return false;
  }
  const codeBlock = parentBlock;
  const captionContainer = getCaptionContainer(codeBlock);
  return parentContainer === captionContainer;
}

export function removeCodeCaption(editor: NextEditor, codeBlock: BlockElement) {
  if (editor.readonly) {
    return;
  }
  const captionContainer = getCaptionContainer(codeBlock);
  if (!captionContainer) {
    return;
  }
  //
  const textContainer = getTextContainer(codeBlock);
  const lastBlock = getLastChildBlock(textContainer);
  editor.selection.selectBlock(lastBlock, getBlockTextLength(editor, lastBlock));
  //
  //
  const oldData = editor.getBlockData(codeBlock) as DocCodeBlockData;
  assert(logger, oldData.children.length === 2, 'code block should have only one child');
  const captionContainerId = oldData.children[1];
  const newData = {
    ...oldData,
    children: [oldData.children[0]],
  };
  editor.updateBlockData(codeBlock, newData);
  editor.deleteChildContainers([captionContainerId]);
}
