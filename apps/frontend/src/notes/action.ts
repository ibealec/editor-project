import { Note } from '../shared/types';

export const GET_NOTES = (query?: any) => ({
  type: 'FETCH_NOTES_REQUEST',
  payload: query,
  meta: { retry: true },
});
export const GET_NOTE = (id: string) => ({
  type: 'FETCH_NOTE_REQUEST',
  payload: id,
});
export const POST_NOTE = (note: Partial<Note>) => ({
  type: 'POST_NOTE_REQUEST',
  payload: note,
});
