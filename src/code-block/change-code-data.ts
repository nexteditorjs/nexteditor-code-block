import { BlockElement, NextEditor } from '@nexteditorjs/nexteditor-core';
import { DocCodeBlockData } from './code-block-data';

export function changeCodeBlockLanguage(editor: NextEditor, codeBlock: BlockElement, language: string) {
  //
  const data = editor.getBlockData(codeBlock) as DocCodeBlockData;
  const newData: DocCodeBlockData = {
    ...data,
    language,
  };
  editor.updateBlockData(codeBlock, newData);
}

export function changeCodeBlockWrap(editor: NextEditor, codeBlock: BlockElement, nowrap: boolean) {
  //
  const data = editor.getBlockData(codeBlock) as DocCodeBlockData;
  const newData: DocCodeBlockData = {
    ...data,
    nowrap,
  };
  editor.updateBlockData(codeBlock, newData);
}
