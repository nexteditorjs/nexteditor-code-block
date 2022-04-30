import { assert, BlockElement, ConvertBlockResult, genId, getLogger, isTextKindBlock, NextEditor, toPlainText } from '@nexteditorjs/nexteditor-core';
import { DocCodeBlockData } from './code-block-data';

import { getLanguageKeyFromAlias } from './languages';

const logger = getLogger('convert-to-code');

export function convertToCode(editor: NextEditor, srcBlock: BlockElement): ConvertBlockResult | null {
  //
  if (!isTextKindBlock(editor, srcBlock)) {
    return null;
  }
  const textBlock = {
    id: genId(),
    type: 'text',
    text: [],
  };
  const textContainerId = genId();
  editor.doc.localInsertChildContainer(textContainerId, [textBlock]);
  //
  const text = editor.getBlockData(srcBlock).text;
  assert(logger, text, 'no text');
  let alias = toPlainText(text);
  if (alias.startsWith('```')) {
    alias = alias.substring(3);
  }
  //
  const language = getLanguageKeyFromAlias(alias);
  //
  const codeData: DocCodeBlockData = {
    id: genId(),
    type: 'code',
    language,
    children: [textContainerId],
  };
  return {
    blockData: codeData,
    focusBlockId: textBlock.id,
  };
}
