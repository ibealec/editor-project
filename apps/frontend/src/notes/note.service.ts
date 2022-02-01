import { Note } from '../shared/types';

export const postNote = (payload: Partial<Note>) => {
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
