import { Box, BoxProps } from '@mui/material';
import React from 'react';

const Row: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    {...props}
    sx={{
      ...props.sx,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    }}
  >
    {children}
  </Box>
);

export default Row;
