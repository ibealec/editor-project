import { Badge, BadgeTypeMap, Paper, TextField } from '@mui/material';
import React from 'react';
import { ReadyState } from 'react-use-websocket';
import { Editor } from '../editor';
import { useNote } from './hooks';
import { patchNote } from './note.service';

interface SingleNoteProps {
  id: string;
}

const Home: React.FC<SingleNoteProps> = ({ id }) => {
  const { note, readyState } = useNote(id);

  const [noteTitle, setNoteTitle] = React.useState(note?.title);

  function handleTextChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNoteTitle(event.target.value);
    if (event.target.value !== note?.title) {
      patchNote(id, { title: event.target.value }).then((res) => {
        console.log('res:', res);
      });
    }
  }

  React.useEffect(() => {
    if (note?.title) {
      setNoteTitle(note.title);
    }
  }, [note?.title]);

  // React.useEffect(() => {
  //   if (noteTitle) {
  //     patchNote(id, { title: noteTitle }).then((res) => {
  //       console.log('res:', res);
  //     });
  //   }
  // }, [noteTitle]);

  const connectionStatusColor = {
    [ReadyState.CONNECTING]: 'info',
    [ReadyState.OPEN]: 'success',
    [ReadyState.CLOSING]: 'warning',
    [ReadyState.CLOSED]: 'error',
    [ReadyState.UNINSTANTIATED]: 'error',
  }[readyState] as BadgeTypeMap['props']['color'];

  return note ? (
    <>
      <Badge color={connectionStatusColor} variant="dot" sx={{ width: '100%' }}>
        <TextField
          value={noteTitle}
          onChange={handleTextChange}
          variant="standard"
          fullWidth={true}
          inputProps={{ style: { fontSize: 32, color: '#666' } }}
          sx={{ mb: 2 }}
        />
      </Badge>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Editor id={id} initialValue={note.content} />
      </Paper>
    </>
  ) : null;
};

export default Home;
