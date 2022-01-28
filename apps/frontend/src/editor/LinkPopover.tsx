import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import { IconButton, Popover, Tooltip } from '@mui/material';
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
  };

  const open = Boolean(anchorEl);

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
      <Row
        sx={{
          padding: '0.5rem',
          alignItems: 'center',
        }}
      >
        <PublicIcon sx={{ marginRight: '8px' }} />
        <a href={element.url} target="_blank" rel="noopener noreferrer">
          {element.url?.length || 0 > 20
            ? `${element.url?.substring(0, 22)}...`
            : element.url}
        </a>
        <Tooltip title="Copy link">
          <IconButton
            aria-label="copy"
            color="inherit"
            size="small"
            sx={{ marginLeft: '8px' }}
            onClick={() => {
              if (element.url) {
                navigator.clipboard.writeText(element.url);
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
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Row>
    </Popover>
  );
};

export default LinkPopover;
