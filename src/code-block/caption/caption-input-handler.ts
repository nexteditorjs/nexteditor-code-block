import {
  assert, getBlockIndex, getContainerId, getLogger,
  getNextBlock, getParentContainer, isEmptyTextBlock, NextEditor,
  NextEditorCustom, NextEditorInputHandler,
} from '@nexteditorjs/nexteditor-core';
import { getParentCodeBlock } from '../code-block-dom';
import { isCodeCaptionBlock, removeCodeCaption } from './code-caption';

const logger = getLogger('code-caption-input-handler');

function getCurrentCaptionBlock(editor: NextEditor) {
  if (!editor.selection.range.isSimple()) {
    return null;
  }
  //
  const start = editor.selection.range.start;
  if (!start.isSimple()) {
    return null;
  }
  //
  const block = editor.getBlockById(start.blockId);
  if (!isCodeCaptionBlock(editor, block)) {
    return null;
  }
  //
  return block;
}

function handleEditorEnterEvent(editor: NextEditor): boolean {
  //
  const block = getCurrentCaptionBlock(editor);
  if (!block) {
    return false;
  }
  const codeBlock = getParentCodeBlock(block);
  const nextBlock = getNextBlock(codeBlock);
  if (nextBlock) {
    editor.selection.selectBlock(nextBlock, 0);
    return true;
  }
  //
  editor.insertTextBlock('', getContainerId(getParentContainer(codeBlock)), getBlockIndex(codeBlock) + 1);
  return true;
}

function handleEditorBackspaceEvent(editor: NextEditor): boolean {
  //
  const block = getCurrentCaptionBlock(editor);
  if (!block) {
    return false;
  }
  //
  if (isEmptyTextBlock(editor, block)) {
    const codeBlock = getParentCodeBlock(block);
    removeCodeCaption(editor, codeBlock);
    return true;
  }
  return false;
}

export default class CodeBlockCaptionInputHandler implements NextEditorInputHandler, NextEditorCustom {
  constructor(editor: NextEditor) {
    setTimeout(() => {
      editor.input.addHandler(this);
    });
  }

  destroy() {
    //
  }

  handleBeforeKeyDown(editor: NextEditor, event: KeyboardEvent): boolean {
    if (event.key === 'Enter') {
      return handleEditorEnterEvent(editor);
    }
    //
    if (event.key === 'Backspace') {
      return handleEditorBackspaceEvent(editor);
    }
    //
    return false;
  }

  handleBeforePaste(editor: NextEditor, event: ClipboardEvent): boolean {
    const block = getCurrentCaptionBlock(editor);
    if (!block) {
      return false;
    }
    //
    if (!event.clipboardData) {
      return true;
    }
    //
    const text = event.clipboardData.getData('text/plain');
    if (!text) {
      return true;
    }
    //
    editor.undoManager.runInGroup(() => {
      editor.clearSelectedContents();
      const start = editor.selection.range.start;
      assert(logger, start.isSimple(), 'not simple position');
      editor.insertTextToBlock(block, start.offset, text);
    });
    return true;
  }

  static init(editor: NextEditor) {
    editor.addCustom('code-block-caption-input-handler', (editor) => new CodeBlockCaptionInputHandler(editor));
  }
}
