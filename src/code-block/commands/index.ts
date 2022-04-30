import { BlockCommandItem, BlockElement, CommandParams, NextEditor, NextEditorCommandProvider, SelectionRange } from '@nexteditorjs/nexteditor-core';
import { isCodeTextBlock } from '../child-container';

class CodeBlockCommandProvider implements NextEditorCommandProvider {
  constructor(editor: NextEditor) {
    setTimeout(() => {
      editor.editorCommandProviders.registerCommandProvider(this);
    });
  }

  destroy() {
    //
  }

  getAvailableCommands(): BlockCommandItem[] {
    return [];
  }

  executeCommand(): boolean {
    return false;
  }

  filterCommands(editor: NextEditor, block: BlockElement, range: SelectionRange, commands: BlockCommandItem[]): BlockCommandItem[] | undefined {
    if (isCodeTextBlock(block)) {
      return [];
    }
    return undefined;
  }

  beforeExecuteCommand(editor: NextEditor, block: BlockElement, range: SelectionRange, command: string, params: CommandParams): boolean | undefined {
    if (isCodeTextBlock(block)) {
      // ignore all commands
      return true;
    }
    return false;
  }
}

export function registerCodeBlockCommandProvider(editor: NextEditor) {
  editor.addCustom('code-block-command-provider', (editor) => new CodeBlockCommandProvider(editor));
}
