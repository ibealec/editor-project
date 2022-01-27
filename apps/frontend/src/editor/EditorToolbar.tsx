import { Box } from '@mui/material';
import React, { MouseEventHandler } from 'react';
import { useSlate } from 'slate-react';
import { VL } from '../shared';
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
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
      <BlockButton format={CustomElementType.blockQuote} icon="quote" />
      <BlockButton
        format={CustomElementType.numberedList}
        icon="list_numbered"
      />
      <BlockButton
        format={CustomElementType.bulletedList}
        icon="list_bulleted"
      />
    </Box>
  );
};
