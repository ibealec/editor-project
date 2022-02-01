import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { NotesList } from '../notes';
import { usePostNote } from '../notes/hooks';
import { Row } from '../shared';
const drawerWidth = 240;

interface InterfaceProps {
  activeNoteId?: string;
}

const Interface: React.FC<InterfaceProps> = ({ activeNoteId, children }) => {
  // const [res, apiMethod] = usePostNote();

  const router = useRouter();

  const [newNoteTitle, setNewNoteTitle] = React.useState('');
  const [toggleAddMode, setToggleAddMode] = React.useState(false);

  function handleAdd() {
    usePostNote({ title: newNoteTitle }).then((data) => {
      setToggleAddMode(false);
      router.push(`${data.id}`);
    });
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar>
          <Row justifyContent="space-between" width="100%">
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Notes
            </Typography>
            <IconButton
              data-test="toggle-add-button"
              onClick={() => setToggleAddMode(!toggleAddMode)}
            >
              {toggleAddMode ? <RemoveIcon /> : <AddIcon />}
            </IconButton>
          </Row>
        </Toolbar>
        <Divider />
        {toggleAddMode ? (
          <Row sx={{ padding: '1rem' }}>
            <TextField
              data-test="create-note-input"
              label="Title"
              size="small"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
            ></TextField>{' '}
            <Button data-test="add-button" onClick={handleAdd}>
              Add
            </Button>
          </Row>
        ) : null}

        <NotesList activeNoteId={activeNoteId} />
        <Divider />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          backgroundColor: '#eee',
          overflow: 'auto',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Interface;
