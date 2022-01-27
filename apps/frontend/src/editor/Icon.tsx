import CodeIcon from '@mui/icons-material/Code';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import * as React from 'react';
import styled from 'styled-components';
interface IconProps {
  name: string;
}

function determineIcon(icon: string) {
  switch (icon) {
    case 'bold':
      return <FormatBoldIcon />;

    case 'italic':
      return <FormatItalicIcon />;

    case 'underlined':
      return <FormatUnderlinedIcon />;

    case 'code':
      return <CodeIcon />;

    case 'quote':
      return <FormatQuoteIcon />;

    case 'list_numbered':
      return <FormatListNumberedIcon />;

    case 'list_bulleted':
      return <FormatListBulletedIcon />;

    case 'h1':
      return <LooksOneIcon />;

    case 'h2':
      return <LooksTwoIcon />;

    default:
      return <>{icon}</>;
  }
}

const Icon: React.FC<IconProps> = ({ name }) => (
  <IconContainer>{determineIcon(name)}</IconContainer>
);

export default Icon;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
