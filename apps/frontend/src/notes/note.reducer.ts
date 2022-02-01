import { ActionWithPayload, Note } from '../shared/types';

export interface NoteIndex {
  [key: string]: Note;
}
export interface NoteModelState {
  notes?: Array<string>;
  notesById: NoteIndex;
}

const defaultState: NoteModelState = {
  notes: [],
  notesById: {},
};

export default function noteReducer(
  state = defaultState,
  action: ActionWithPayload<NoteIndex>
): NoteModelState {
  switch (action.type) {
    case 'note/save':
      return {
        ...state,
        notes: action.payload && Object.keys(action.payload),
        notesById: {
          ...state?.notesById,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
