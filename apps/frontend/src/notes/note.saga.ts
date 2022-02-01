import { Action } from 'redux';
import { call, SagaReturnType, takeEvery } from 'redux-saga/effects';
import { Note } from '../shared/types';
import { postNote } from './note.service';

interface SagaProps {
  payload?: Partial<Note>;
}

export function* create({ payload }: SagaProps) {
  try {
    const response: SagaReturnType<typeof postNote> = yield call(
      postNote,
      payload
    );
  } catch (error) {
    console.log('Error creating note', error);
  }
}

interface NoteAction extends Action, Note {
  type: 'POST_NOTE_REQUEST';
}

export default function* rootSaga() {
  // @ts-ignore
  yield takeEvery<NoteAction>('POST_NOTE_REQUEST', create);
}
