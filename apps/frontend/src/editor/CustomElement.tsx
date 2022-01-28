import React, { MouseEvent } from 'react';
import { BaseElement } from 'slate';
import { RenderElementProps } from 'slate-react';
import { v4 as id } from 'uuid';
import LinkPopover from './LinkPopover';

export enum CustomElementType {
  blockQuote = 'block-quote',
  bulletedList = 'bulleted-list',
  headingOne = 'heading-one',
  headingTwo = 'heading-two',
  listItem = 'list-item',
  numberedList = 'numbered-list',
  paragraph = 'paragraph',
  link = 'link',
  image = 'image',
}

export interface CustomElement extends BaseElement {
  type: CustomElementType;
  url?: string;
}

export const CustomElement: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  switch (element.type) {
    case CustomElementType.blockQuote:
      return <blockquote {...attributes}>{children}</blockquote>;
    case CustomElementType.bulletedList:
      return <ul {...attributes}>{children}</ul>;
    case CustomElementType.headingOne:
      return <h1 {...attributes}>{children}</h1>;
    case CustomElementType.headingTwo:
      return <h2 {...attributes}>{children}</h2>;
    case CustomElementType.listItem:
      return <li {...attributes}>{children}</li>;
    case CustomElementType.numberedList:
      return <ol {...attributes}>{children}</ol>;
    case CustomElementType.link:
      const elId = id();
      return (
        <div>
          <LinkPopover
            element={element}
            anchorEl={anchorEl}
            elId={elId}
            setAnchorEl={setAnchorEl}
          />
          <a
            aria-describedby={elId}
            href={element.url}
            onClick={handleClick}
            rel="noopener noreferrer"
            {...attributes}
          >
            {children}
          </a>
        </div>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};
