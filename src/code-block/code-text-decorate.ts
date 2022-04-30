import {
  assert, BlockPath, DocBlockText, DocBlockTextAttributes,
  DocBlockTextOp, DocInsertion, getLogger, getTextLength,
  NextEditor, NextEditorDecorator, toPlainText,
} from '@nexteditorjs/nexteditor-core';
import Prism from 'prismjs';
import cloneDeep from 'lodash.clonedeep';
import { DocCodeBlockData } from './code-block-data';

const logger = getLogger('code-text-decorate');

export default class CodeTextDecorator implements NextEditorDecorator {
  decorateText(editor: NextEditor, path: BlockPath, blockText: DocBlockText): { insertions?: Map<number, DocInsertion[]>, text?: DocBlockText } {
    //
    assert(logger, path.length > 0, 'invalid path');
    logger.log(path.map((p) => `${p.containerId}/${p.blockIndex}`).join());
    if (path.length === 1) {
      return {};
    }
    const parentBlockPath = path[path.length - 2];
    const parentBlock = editor.doc.getBlockData(parentBlockPath.containerId, parentBlockPath.blockIndex);
    if (parentBlock.type !== 'code') {
      return {};
    }
    //
    const text = blockText;
    if (text.length === 0) {
      return {};
    }
    //
    const code = toPlainText(text);
    const codeData = editor.doc.getBlockData(parentBlockPath.containerId, parentBlockPath.blockIndex) as DocCodeBlockData;
    // const language = SUPPORTED_LANGUAGES[codeData.language as unknown as keyof typeof SUPPORTED_LANGUAGES];
    const tokens = Prism.tokenize(code, Prism.languages[codeData.language] ?? Prism.languages.plain);
    //
    const tokenToText = (token: Prism.Token | string, attributes: DocBlockTextAttributes): DocBlockTextOp[] => {
    //
      assert(logger, token, 'no token');
      if (typeof token === 'string') {
        const ret: DocBlockTextOp = {
          insert: token,
          attributes: cloneDeep(attributes),
        };
        return [ret];
      }
      //
      assert(logger, token instanceof Prism.Token, 'invalid token type');
      const content = token.content;
      const newAttributes = cloneDeep(attributes);
      newAttributes[`style-code-${token.type}`] = true;
      //
      if (typeof content === 'string') {
        const ret: DocBlockTextOp = {
          insert: content,
          attributes: newAttributes,
        };
        return [ret];
      }
      //
      if (Array.isArray(content)) {
        const tokens = content as Prism.Token[];
        const ret: DocBlockTextOp[] = tokens.map((t) => tokenToText(t, newAttributes)).flat();
        return ret;
      }
      //
      assert(logger, content instanceof Prism.Token, 'invalid token');
      //
      return tokenToText(content, newAttributes);
    };

    //
    const ops = tokens.map((token) => tokenToText(token, {}));
    const newText = ops.flat();
    assert(logger, getTextLength(newText) === getTextLength(text), 'failed to highlight code, text length mismatch');
    //
    return {
      text: newText,
    };
  }
}
