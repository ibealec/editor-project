import React, { MouseEventHandler } from 'react';
import { Editor, Path, Range, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { Row, VL } from '../shared';
import AddLinkButton from './AddLinkButton';
import { CustomElementType } from './CustomElement';
import { CustomText } from './CustomLeaf';
import {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from './helpers';
import Icon from './Icon';

interface ButtonProps {
  active: boolean;
  onMouseDown: MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({ active, children, onMouseDown }) => (
  <button
    onMouseDown={onMouseDown}
    style={{
      backgroundColor: active ? '#333' : 'white',
      color: active ? 'white' : '#333',
      border: '1px solid #eee',
      marginRight: '0.3rem',
      marginLeft: '0.3rem',
      cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

interface BlockButtonProps {
  format: CustomElementType;
  icon: string;
}

const BlockButton: React.FC<BlockButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon name={icon} />
    </Button>
  );
};

const createLinkNode = (href: string, text: string) => ({
  type: 'link',
  href,
  children: [{ text }],
});

const removeLink = (editor: Editor, opts = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: (n) => !Editor.isEditor(n) && n.type === 'link',
  });
};

const insertLink = (editor: Editor, url: string) => {
  if (!url) return;

  const { selection } = editor;
  const link = createLinkNode(url, 'New Link');

  ReactEditor.focus(editor);

  if (!!selection) {
    const [parentNode, parentPath] = Editor.parent(
      editor,
      selection.focus?.path
    );

    if (parentNode.type === 'link') {
      removeLink(editor);
    }

    if (editor.isVoid(parentNode)) {
      // Insert the new link after the void node
      console.log('IS VOID');
      Transforms.insertNodes(
        editor,
        [
          {
            children: [link],
            type: 'paragraph',
          },
        ],
        {
          at: Path.next(parentPath),
          select: true,
        }
      );
    } else if (Range.isCollapsed(selection)) {
      console.log('IS< COLLAPS');
      Transforms.insertNodes(editor, link, { select: true });
    } else {
      console.log('WRAPS');
      Transforms.wrapNodes(editor, link, { split: true });
      Transforms.collapse(editor, { edge: 'end' });
    }
  } else {
    console.log('ELSe ');

    Transforms.insertNodes(editor, [
      {
        children: [link],
        type: 'paragraph',
      },
    ]);
  }
};

interface MarkButtonProps {
  format: keyof CustomText;
  icon: string;
}

const MarkButton: React.FC<MarkButtonProps> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon name={icon} />
    </Button>
  );
};

export const EditorToolbar: React.FC = () => {
  const editor = useSlate();

  return (
    <Row
      sx={{
        justifyContent: 'center',
        borderBottom: '1px solid #eee',
        paddingBottom: '1rem',
      }}
    >
      <MarkButton format="bold" icon="bold" />
      <MarkButton format="italic" icon="italic" />
      <MarkButton format="underline" icon="underlined" />
      <MarkButton format="code" icon="code" />
      <VL />
      <BlockButton format={CustomElementType.headingOne} icon="h1" />
      <BlockButton format={CustomElementType.headingTwo} icon="h2" />
      <VL />
      {/* <BlockButton format={CustomElementType.link} icon="link" /> */}
      <AddLinkButton />

      <BlockButton format={CustomElementType.blockQuote} icon="quote" />
      <BlockButton
        format={CustomElementType.numberedList}
        icon="list_numbered"
      />
      <BlockButton
        format={CustomElementType.bulletedList}
        icon="list_bulleted"
      />
    </Row>
  );
};
