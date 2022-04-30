import { DocBlock } from '@nexteditorjs/nexteditor-core';

export interface DocCodeBlockData extends DocBlock {
  type: 'code';
  language: string;
  children: string[];
  nowrap?: boolean;
}
