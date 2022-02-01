// @refresh reset // Fixes hot refresh errors in development https://github.com/ianstormtaylor/slate/issues/3477

import { HocuspocusProvider } from '@hocuspocus/provider';
import { withYHistory, withYjs, YjsEditor } from '@slate-yjs/core';
import React, { useCallback, useMemo, useState } from 'react';
import { BaseEditor, createEditor, Descendant } from 'slate';
import { HistoryEditor } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import * as Y from 'yjs';
import { CustomElement } from './CustomElement';
import { CustomLeaf, CustomText } from './CustomLeaf';
import { EditorToolbar } from './EditorToolbar';
import { handleHotkeys, withHtml } from './helpers';

// Slate suggests overwriting the module to include the ReactEditor, Custom Elements & Text
// https://docs.slatejs.org/concepts/12-typescript
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface EditorProps {
  initialValue?: Descendant[];
  placeholder?: string;
  id: string;
}

export const Editor: React.FC<EditorProps> = ({
  initialValue = [],
  placeholder,
  id,
}) => {
  const [value, setValue] = useState<Array<Descendant>>(initialValue);

  const renderLeaf = useCallback((props) => <CustomLeaf {...props} />, []);

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: 'ws://localhost:1234',
        name: id,
      }),
    []
  );

  React.useEffect(() => () => provider.disconnect(), [provider]);

  const editor = useMemo(() => {
    const sharedType = provider.document.get('content', Y.XmlText);

    return withHtml(
      withReact(withYHistory(withYjs(createEditor(), sharedType)))
    );
  }, [provider.document]);

  const renderElement = useCallback(
    (props) => <CustomElement {...props} />,
    []
  );

  React.useEffect(() => () => YjsEditor.disconnect(editor), []);

  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <EditorToolbar />
      <Editable
        data-test="editor"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        onKeyDown={handleHotkeys(editor)}
        // The dev server injects extra values to the editr and the console complains
        // so we override them here to remove the message
        autoCapitalize="false"
        autoCorrect="false"
        spellCheck="false"
      />
    </Slate>
  );
};
