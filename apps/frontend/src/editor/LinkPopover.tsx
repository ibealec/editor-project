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
import { Row } from '../shared';
import type { CustomElement } from './CustomElement';

interface LinkPopoverProps {
  element: CustomElement;
  anchorEl: Element | null;
  setAnchorEl: (element: Element | null) => void;
  elId: string;
}

const LinkPopover: React.FC<LinkPopoverProps> = ({
  element,
  anchorEl,
  setAnchorEl,
  elId,
}) => {
  const handleClose = () => {
    setAnchorEl(null);
    setTimeout(() => {
      setIsCollapsed(true);
    }, 500);
  };

  console.log('E', element.children);

  const open = Boolean(anchorEl);

  const [textValue, setTextValue] = React.useState(
    element.children[0].text || ''
  );

  // @TODO
  // Bring in react-hook-form and validate the url

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
          }}
        >
          {isCollapsed ? (
            <>
              <PublicIcon sx={{ marginRight: '8px' }} />
              <a href={element.url} target="_blank" rel="noopener noreferrer">
                {element.url?.length || 0 > 20
                  ? `${element.url?.substring(0, 22)}...`
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
            <Button sx={{ marginRight: 0, paddingRight: 0 }}>Apply</Button>
          </Row>
        </Collapse>
      </Box>
    </Popover>
  );
};

export default LinkPopover;
