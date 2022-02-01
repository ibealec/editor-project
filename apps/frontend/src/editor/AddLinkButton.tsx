import { Link } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import * as React from 'react';
import { Editor, Path, Range, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';

interface AddLinkButtonProps {}

export default function AddLinkButton({}: AddLinkButtonProps) {
  const editor = useSlate();

  const createLinkNode = (href: string, text: string) => ({
    type: 'link',
    url: href,
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
        Transforms.insertNodes(editor, link, { select: true });
      } else {
        Transforms.wrapNodes(editor, link, { split: true });
        Transforms.collapse(editor, { edge: 'end' });
      }
    } else {
      Transforms.insertNodes(editor, [
        {
          children: [link],
          type: 'paragraph',
        },
      ]);
    }
  };

  return (
    <IconButton onClick={() => insertLink(editor, 'https://example.com')}>
      <Link></Link>
    </IconButton>
  );
}
