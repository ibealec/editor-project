/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { NoteResponse, NotesResponse } from '../../../backend/routes/notes';

export const usePostNote = (payload: { title: string }) => {
  return fetch('http://localhost:3001/api/notes', {
    method: 'POST',
    body: JSON.stringify(payload),

    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then(async (response) => {
    const data = response.json();
    return data;
  });
};

export const useNotesList = () => {
  const { readyState, lastMessage, sendJsonMessage, sendMessage } =
    useWebSocket(`ws://localhost:3001/api/notes/`) || {};

  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastMessage === null) {
      sendMessage('');
    }
  }, [readyState, lastMessage]);

  return {
    notesList: lastMessage && (JSON.parse(lastMessage.data) as NotesResponse),
    readyState,
  };
};

export const useNote = (id: string) => {
  const { readyState, lastMessage, sendJsonMessage, sendMessage } =
    useWebSocket(`ws://localhost:3001/api/notes/${id}`) || {};

  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastMessage === null) {
      sendMessage('');
    }
    console.log('LMMM', lastMessage);
  }, [readyState, lastMessage]);

  return {
    note: lastMessage && (JSON.parse(lastMessage.data) as NoteResponse),
    readyState,
  };
};
