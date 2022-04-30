import {
  addClass, assert, BlockContentElement, BlockElement, BlockPosition,
  ComplexBlockPosition, ComplexKindBlock, ContainerElement, BlockPath,
  createComplexBlockPosition, DocBlock, EditorComplexSelectionRange,
  getChildBlockCount,
  getContainerId, getLogger, isContainer, MoveDirection, NextContainerOptions,
  NextEditor, removeClass, SelectionRange, SimpleBlockPosition,
} from '@nexteditorjs/nexteditor-core';
import { DocCodeBlockData } from './code-block-data';
import { isCodeBlock, updateCodeBlockElementStyles } from './code-block-dom';
import { convertToCode } from './convert-to-code';

import './code-block.scss';
import { handlePasteInTableEvent } from './paste';
import { registerCodeBlockCommandProvider } from './commands';
import { getCaptionContainer, getCodeChildContainers, getTextContainer } from './child-container';
import { createCodeBlockContent } from './code-block-content';

const logger = getLogger('list-block');

function createBlockContent(editor: NextEditor, path: BlockPath, container: ContainerElement, blockElement: BlockElement, blockData: DocBlock): BlockContentElement {
  handlePasteInTableEvent(editor);
  registerCodeBlockCommandProvider(editor);
  assert(logger, blockData.type === 'code', 'invalid block data type');
  const codeData = blockData as DocCodeBlockData;
  assert(logger, codeData.children, 'invalid block data children');
  assert(logger, codeData.children.length === 1 || codeData.children.length === 2, 'invalid block data children length');
  return createCodeBlockContent(editor, path, blockElement, codeData);
}

function getBlockTextLength(block: BlockElement): number {
  return 1;
}

function getRangeFromPoint(editor: NextEditor, block: BlockElement, x: number, y: number): SelectionRange | null {
  const elem = document.elementsFromPoint(x, y)[0];
  if (!elem) return null;
  //
  if (!block.contains(elem)) return null;
  if (!editor.contains(block)) return null;
  //
  if (!isContainer(elem)) return null;
  //
  const containers = getCodeChildContainers(block);
  if (!isContainer(elem)) {
    return null;
  }
  //
  const container = elem as ContainerElement;
  if (containers.indexOf(container) === -1) {
    return null;
  }
  //
  if (getChildBlockCount(container) > 1) {
    return null;
  }
  //
  const startPos = createComplexBlockPosition(block, getContainerId(container));
  return new EditorComplexSelectionRange(editor, startPos);
}

function moveCaret(editor: NextEditor, block: BlockElement, position: SimpleBlockPosition, direction: MoveDirection): SimpleBlockPosition | null {
  return null;
}

function getCaretRect(block: BlockElement, pos: SimpleBlockPosition): DOMRect {
  return block.getBoundingClientRect();
}

function updateSelection(editor: NextEditor, block: BlockElement, from: BlockPosition, to: BlockPosition): void {
  if (from.isSimple()) {
    assert(logger, to.isSimple(), 'from is simple position but to is not simple position');
    //
    logger.debug('full select list');
    addClass(block, 'full-selected');
    //
    return;
  }
  //
  assert(logger, !to.isSimple(), 'from is complex position but end is simple position');
  //
  const f = from as ComplexBlockPosition;
  const t = to as ComplexBlockPosition;
  assert(logger, f.blockId === t.blockId, 'only allow update one table selection');
  //
  const containers = getCodeChildContainers(block);
  containers.forEach((container) => {
    const containerId = getContainerId(container);
    if (containerId === f.childContainerId || containerId === t.childContainerId) {
      addClass(container, 'selected');
    }
  });
}

function clearSelection(editor: NextEditor): void {
  editor.rootContainer.querySelectorAll('[data-type="editor-block"][data-block-type="code"]').forEach((block) => {
    removeClass(block, 'full-selected');
    //
    block.querySelectorAll('div[data-type=editor-container].child.selected').forEach((c) => {
      removeClass(c, 'selected');
    });
    //
  });
}

function getChildContainers(editor: NextEditor, complexBlock: BlockElement): ContainerElement[] {
  return getCodeChildContainers(complexBlock);
}

function getNextContainer(editor: NextEditor, complexBlock: BlockElement, childContainer: ContainerElement, type: MoveDirection, options?: NextContainerOptions): ContainerElement | null {
  if (type === 'ArrowDown' || type === 'ArrowRight') {
    if (childContainer === getTextContainer(complexBlock)) {
      return getCaptionContainer(complexBlock);
    }
  } else if (childContainer === getCaptionContainer(complexBlock)) {
    return getTextContainer(complexBlock);
  }
  return null;
}

function getSelectedContainers(editor: NextEditor, complexBlock: BlockElement, start: ComplexBlockPosition, end: ComplexBlockPosition): ContainerElement[] {
  const childContainers = getCodeChildContainers(complexBlock);
  const containersIds = childContainers.map(getContainerId);
  //
  const startIndex = containersIds.indexOf(start.childContainerId);
  const endIndex = containersIds.indexOf(end.childContainerId);
  assert(logger, startIndex !== -1, 'invalid start pos');
  assert(logger, endIndex !== -1, 'invalid end pos');
  //
  const ret = [childContainers[startIndex]];
  if (startIndex !== endIndex) {
    ret.push(childContainers[endIndex]);
  }
  return ret;
}

function handleBlockElementUpdated(editor: NextEditor, block: BlockElement, blockData: DocBlock): void {
  assert(logger, isCodeBlock(block), 'invalid block type');
  const codeData = blockData as DocCodeBlockData;
  updateCodeBlockElementStyles(editor, block, codeData);
}

const CodeBlock: ComplexKindBlock = {
  blockType: 'code',
  blockKind: 'complex',
  createBlockContent,
  getBlockTextLength,
  getRangeFromPoint,
  moveCaret,
  getCaretRect,
  updateSelection,
  clearSelection,
  getChildContainers,
  getNextContainer,
  getSelectedContainers,
  convertFrom: convertToCode,
  handleBlockElementUpdated,
};

export default CodeBlock;
