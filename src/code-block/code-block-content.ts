import {
  BlockContentElement, BlockElement,
  BlockPath, createBlockContentElement, createElement,
  NextEditor,
} from '@nexteditorjs/nexteditor-core';
import { DocCodeBlockData } from './code-block-data';
import { updateCodeBlockElementStyles } from './code-block-dom';
import { createCodeBlockHeader } from './header';

export function createCodeBlockContent(editor: NextEditor, path: BlockPath, blockElement: BlockElement, codeData: DocCodeBlockData): BlockContentElement {
  const children = codeData.children;
  const blockContent = createBlockContentElement(blockElement, 'div');
  blockContent.setAttribute('data-language', codeData.language || 'text');
  //
  updateCodeBlockElementStyles(editor, blockElement, codeData);
  //
  const codeRoot = createElement('div', ['editor-code-root'], blockContent);
  const textRoot = createElement('div', ['code-text-root'], codeRoot);

  editor.createChildContainer(path, textRoot, children[0]);
  if (children.length === 2) {
    const captionRoot = createElement('div', ['code-caption-root'], codeRoot);
    editor.createChildContainer(path, captionRoot, children[1]);
  }
  //
  createCodeBlockHeader(editor, blockElement, codeData);
  //
  return blockContent as BlockContentElement;
}
