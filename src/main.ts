/* eslint-disable import/no-extraneous-dependencies */
import {
  assert,
  createEditor,
  createEmptyDoc,
  getLogger,
  LocalDoc,
} from '@nexteditorjs/nexteditor-core';
import { MarkdownInputHandler } from '@nexteditorjs/nexteditor-input-handlers';

import { CodeBlock, CodeTextDecorator } from './code-block';

import './style.css';

const logger = getLogger('main');

const app = document.querySelector<HTMLDivElement>('#app');
assert(logger, app, 'app does not exists');

const editor = createEditor(app, new LocalDoc(createEmptyDoc()), {
  components: {
    blocks: [CodeBlock],
    decorators: [new CodeTextDecorator()],
  },
});

editor.input.addHandler(new MarkdownInputHandler());

(window as any).editor = editor;
