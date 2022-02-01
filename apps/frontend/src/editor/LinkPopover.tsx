import { Search } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import {
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Popover,
  TextField,
  Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { Row } from '../shared';
import type { CustomElement } from './CustomElement';

interface LinkPopoverProps {
  element: CustomElement;
  anchorEl: Element | null;
  setAnchorEl: (element: Element | null) => void;
  elId: string;
  elementUrl: string;
  setElementUrl: (elementUrl: string) => void;
}

const LinkPopover: React.FC<LinkPopoverProps> = ({
  element,
  anchorEl,
  setAnchorEl,
  elId,
}) => {
  // @TODO
  // Bring in react-hook-form and validate the url
  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => {
      setIsCollapsed(true);
    }, 500);
  };

  const open = Boolean(anchorEl);

  const [textValue, setTextValue] = React.useState(
    element.children[0].text || ''
  );
  const [urlValue, setUrlValue] = React.useState(element.url || '');
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [copyText, setCopyText] = React.useState('Copy Link');

  React.useEffect(() => {
    if (copyText === 'Copied!') {
      setTimeout(() => {
        setCopyText('Copy Link');
      }, 3000);
    }
  }, [copyText]);

  const editor = useSlate();

  function updateLink() {
    handleClose();
    const urlElements = Editor.nodes(editor, {
      at: [], // Path of Editor
      match: (node, path) => 'link' === node.type,
      // mode defaults to "all", so this also searches the Editor's children
    });
    for (const nodeEntry of urlElements) {
      if (nodeEntry[0].children[0].text === textValue) {
        Transforms.select(editor, nodeEntry[1]);
      }
    }
    Transforms.insertFragment(editor, [
      {
        children: [{ text: textValue }],
        type: 'link',
        url: urlValue,
      },
    ]);
  }

  React.useEffect(() => {}, [textValue, editor]);

  function changeText(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === '') {
      setTextValue(' ');
    } else {
      setTextValue(e.target.value.trimStart());
    }

    const urlElements = Editor.nodes(editor, {
      at: [], // Path of Editor
      match: (node, path) => 'link' === node.type,
      // mode defaults to "all", so this also searches the Editor's children
    });
    // We Trim here because we want to make sure that the text is not empty
    // Otherwise the link will be removed
    if (urlElements) {
      try {
        for (const nodeEntry of urlElements) {
          if (
            nodeEntry[0].children[0].text.trimStart() === textValue.trimStart()
          ) {
            Transforms.select(editor, nodeEntry[1]);
          }
        }
        Transforms.delete(editor);
        Transforms.insertText(
          editor,
          e.target.value === '' ? ' ' : e.target.value.trimStart()
        );
      } catch (e) {
        console.log('Er', e);
      }
    }
  }

  return (
    <Popover
      id={elId}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box width={350}>
        <Row
          sx={{
            padding: '1rem 1rem 0.5rem 1rem',
            justifyContent: 'space-between',
          }}
        >
          {isCollapsed ? (
            <>
              <PublicIcon sx={{ marginRight: '8px' }} />
              <a href={element.url} target="_blank" rel="noopener noreferrer">
                {element.url?.length || 0 > 22
                  ? `${element.url?.substring(0, 24)}...`
                  : element.url}
              </a>
              <Tooltip title={copyText}>
                <IconButton
                  aria-label="copy"
                  color="inherit"
                  size="small"
                  sx={{ marginLeft: '8px' }}
                  onClick={() => {
                    if (element.url) {
                      navigator.clipboard.writeText(element.url);
                      setCopyText('Copied!');
                    }
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit link">
                <IconButton
                  sx={{ marginLeft: '8px' }}
                  aria-label="edit"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsCollapsed(false);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <TextField
              sx={{ width: '100%' }}
              value={textValue}
              onChange={changeText}
              label="Text"
              color="primary"
            />
          )}
        </Row>
        <Collapse in={!isCollapsed}>
          <Row
            sx={{
              padding: '0.5rem 1rem 1rem 1rem',
            }}
          >
            <OutlinedInput
              id="outlined-adornment-amount"
              sx={{ width: '100%' }}
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            />
            <Button
              onClick={updateLink}
              sx={{ marginRight: 0, paddingRight: 0 }}
            >
              Apply
            </Button>
          </Row>
        </Collapse>
      </Box>
    </Popover>
  );
};

export default LinkPopover;
