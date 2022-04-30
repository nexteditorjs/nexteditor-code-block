import {
  assert, createEmptyDoc, getLogger, getParentBlock,
  getParentContainer, isRootContainer,
  NextEditor, NextEditorInputHandler, SimpleBlockPosition,
} from '@nexteditorjs/nexteditor-core';
import { isCodeCaptionBlock } from '../caption/code-caption';
import { isCodeBlock } from '../code-block-dom';

const logger = getLogger('paste-in-table-block');

class PasteEventHandler implements NextEditorInputHandler {
  constructor(private editor: NextEditor) {
    // editor input has not initialized yet
    setTimeout(() => {
      editor.input.addHandler(this);
    });
  }

  destroy() {
  }

  handleBeforePaste(editor: NextEditor, event: ClipboardEvent): boolean {
    if (!editor.selection.range.isSimple()) {
      return false;
    }
    const start = editor.selection.range.start as SimpleBlockPosition;
    const startBlock = editor.getBlockById(start.blockId);
    const parentContainer = getParentContainer(startBlock);
    if (isRootContainer(parentContainer)) {
      return false;
    }
    const parentBlock = getParentBlock(parentContainer);
    assert(logger, parentBlock, 'no parent block');
    //
    if (!isCodeBlock(parentBlock)) {
      return false;
    }
    //
    if (isCodeCaptionBlock(editor, startBlock)) {
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
    const doc = createEmptyDoc(text);
    editor.undoManager.runInGroup(() => {
      editor.clearSelectedContents();
      editor.insertDoc(startBlock, start.offset, doc);
    });
    return true;
  }
}

export function handlePasteInTableEvent(editor: NextEditor) {
  editor.addCustom('code-block-paste-event', (editor) => new PasteEventHandler(editor));
}
