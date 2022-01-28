import isHotkey from 'is-hotkey';
import { KeyboardEvent } from 'react';
import { BaseEditor, Editor, Element as SlateElement, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { jsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';
import { CustomElementType } from './CustomElement';
import { CustomText } from './CustomLeaf';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const ELEMENT_TAGS = {
  A: (el: HTMLElement) => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  H1: () => ({ type: 'heading-one' }),
  H2: () => ({ type: 'heading-two' }),
  H3: () => ({ type: 'heading-three' }),
  H4: () => ({ type: 'heading-four' }),
  H5: () => ({ type: 'heading-five' }),
  H6: () => ({ type: 'heading-six' }),
  IMG: (el: HTMLElement) => ({ type: 'image', url: el.getAttribute('src') }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'bulleted-list' }),
};

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

export const toggleBlock = (
  editor: Editor,
  format: CustomElementType
): void => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && (n.type as any) // eslint-disable-line @typescript-eslint/no-explicit-any
      ),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive
      ? CustomElementType.paragraph
      : isList
      ? CustomElementType.listItem
      : format,
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const toggleMark = (editor: Editor, format: keyof CustomText): void => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (
  editor: Editor,
  format: CustomElementType
): boolean => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

export const isMarkActive = (
  editor: Editor,
  format: keyof CustomText
): boolean => {
  const marks = Editor.marks(editor);
  return marks ? format in marks === true : false;
};

const HOTKEYS: Record<string, keyof CustomText> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

export const handleHotkeys =
  (editor: Editor) =>
  (event: KeyboardEvent<HTMLDivElement>): void => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
      }
    }
  };

// Pasted content needs to be deserialized into data that Slate can understand.
// Though there are plugins that help with this, we've opted to use code from Slates examples:
// https://github.com/ianstormtaylor/slate/blob/f1b7d18f43913474617df02f747afa0e78154d85/site/examples/paste-html.tsx
// The deserialization is straightforward enough to not warrent using Platejs or any other library.

export const deserialize = (el: ChildNode) => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  }

  // This ensures that <br> elements get deserialized to empty paragraphs, rather than just new lines.
  //  This means the editor will recognize that it's a new paragraph, and place the cursor at the end of it.
  //  https://github.com/ianstormtaylor/slate/issues/3457#issuecomment-577395255

  if (el.nodeName === 'BR') {
    return jsx('element', { type: 'paragraph' }, [{ text: '' }]);
  }

  const { nodeName } = el;
  let parent = el;

  if (
    nodeName === 'PRE' &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === 'CODE'
  ) {
    parent = el.childNodes[0];
  }
  let children: ChildNode[] = Array.from(parent.childNodes)
    .map(deserialize)
    .flat();

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);
    return jsx('element', attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);
    return children.map((child: ChildNode) => jsx('text', attrs, child));
  }

  return children;
};

export const withHtml = (editor: ReactEditor & HistoryEditor & BaseEditor) => {
  const { insertData, isInline, isVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'link' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const html = data.getData('text/html');

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const fragment = deserialize(parsed.body);
      try {
        if (fragment) {
          Transforms.insertFragment(editor, fragment);
        }
      } catch (e) {
        console.log('E', e);
      }

      return;
    }

    insertData(data);
  };

  return editor;
};
