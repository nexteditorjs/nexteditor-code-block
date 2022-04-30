import {
  addClass, assert, BlockElement, CommandItem,
  containerToDoc, createElement, docToText, getBlockTools,
  getBlockType, getContainerId, getLogger,
  getParentBlock, NextEditor, removeClass,
} from '@nexteditorjs/nexteditor-core';
import { DropdownFilterableList, showToast } from '@nexteditorjs/nexteditor-ui-base';
import FilterableList from '@nexteditorjs/nexteditor-ui-base/dist/list/filterable-list';
import ArrowDownIcon from '../../icons/arrow-down';
import CopyIcon from '../../icons/copy';
import WrapIcon from '../../icons/wrap';
import { changeCodeBlockLanguage, changeCodeBlockWrap } from '../change-code-data';
import { DocCodeBlockData } from '../code-block-data';
import { getTextContainer } from '../child-container';
import { SUPPORTED_LANGUAGES } from '../languages';

const logger = getLogger('code-block-header');

const LanguageSelectItems = Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => ({
  id: key,
  name: value.name,
  language: value,
}));

type DropdownFilterableListCustom = {
  editor: NextEditor;
  codeBlock: BlockElement;
};

function handleLanguageSelect(list: FilterableList, item: CommandItem | null) {
  if (item) {
    const dropdown = list as DropdownFilterableList;
    const { editor, codeBlock } = dropdown.custom as DropdownFilterableListCustom;
    changeCodeBlockLanguage(editor, codeBlock, item.id);
    const label = codeBlock.querySelector('.code-block-header .language-select .name-label') as HTMLElement;
    label.innerText = item.name;
  }
}

function createLanguageSelect(editor: NextEditor, codeBlock: BlockElement, languageName: string) {
  //
  editor.addCustom('code-header-language-select-dropdown', (editor) => {
    const list = new DropdownFilterableList(LanguageSelectItems, editor.rootElement, {
      placeholder: 'Search for a language...',
    });
    list.onSelected = handleLanguageSelect;
    return list;
  });

  const elem = createElement('div', ['language-select'], null);
  createElement('span', ['name-label'], elem, languageName);
  const icon = createElement('span', ['arrow-icon'], elem);
  icon.innerHTML = ArrowDownIcon;
  //
  editor.domEvents.addEventListener(elem, 'click', (editor, event) => {
    const target = event.target as HTMLElement;
    const select = target.closest('.language-select') as HTMLElement;
    const block = getParentBlock(select);
    assert(logger, block, 'no parent block');
    assert(logger, getBlockType(block) === 'code', 'not a code block');
    const codeData = editor.getBlockData(block) as DocCodeBlockData;
    const dropdown = editor.getCustom<DropdownFilterableList>('code-header-language-select-dropdown');
    dropdown.custom = { codeBlock: block, editor };
    dropdown.setSelectedId(codeData.language);
    dropdown.show(select);
    //
    addClass(codeBlock, 'editing-language');
    //
    dropdown.onHide = () => {
      removeClass(codeBlock, 'editing-language');
    };
    //
  });
  //
  return elem;
}

function createSpacer() {
  return createElement('div', ['code-header-spacer'], null);
}

function handleCodeHeaderButtonClick(editor: NextEditor, event: Event) {
  //
  const target = event.target as HTMLElement;
  const button = target.closest('.code-header-button');
  assert(logger, button, 'no button');
  const block = getParentBlock(target);
  assert(logger, block, 'no parent block');
  const id = button.getAttribute('data-id');
  //
  assert(logger, getBlockType(block) === 'code', 'not a code block');
  //
  if (id === 'wrap') {
    const old = editor.getBlockData(block) as DocCodeBlockData;
    changeCodeBlockWrap(editor, block, !old.nowrap);
  }
  //
  if (id === 'copy') {
    const codeContainer = getTextContainer(block);
    const doc = containerToDoc(editor, getContainerId(codeContainer));
    const text = docToText(editor, doc);
    navigator.clipboard.writeText(text).then(() => {
      const rect = button.getBoundingClientRect();
      showToast('Copied to clipboard', {
        position: {
          x: rect.x + rect.width / 2,
          y: rect.bottom + 30,
        },
      });
    }).catch((err) => {
      logger.error(err.message);
    });
  }
}

function createButton(editor: NextEditor, id: string, name: string, icon: string | null) {
  const button = createElement('button', ['code-header-button'], null);
  button.setAttribute('data-id', id);
  if (icon) {
    const iconSpan = createElement('span', ['button-icon'], button);
    iconSpan.innerHTML = icon;
  }
  if (name) {
    const labelSpan = createElement('span', ['button-label'], button);
    labelSpan.innerHTML = name;
  }
  //
  editor.domEvents.addEventListener(button, 'click', handleCodeHeaderButtonClick);
  //
  return button;
}

export function createCodeBlockHeader(editor: NextEditor, block: BlockElement, codeData: DocCodeBlockData) {
  const tools = getBlockTools(block);
  const header = createElement('div', ['code-block-header'], tools);
  const language = SUPPORTED_LANGUAGES[codeData.language as keyof typeof SUPPORTED_LANGUAGES] || SUPPORTED_LANGUAGES.plain;

  //
  header.appendChild(createLanguageSelect(editor, block, language.name));
  header.appendChild(createSpacer());
  header.appendChild(createButton(editor, 'copy', 'Copy', CopyIcon));
  header.appendChild(createButton(editor, 'wrap', 'Wrap', WrapIcon));
  header.appendChild(createButton(editor, 'caption', 'Caption', null));
}
