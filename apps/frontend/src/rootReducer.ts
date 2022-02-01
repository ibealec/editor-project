import { combineReducers } from 'redux';
import { default as linkReducer } from './notes/link.reducer';
import { default as noteReducer } from './notes/note.reducer';

export type RootReducerState = {};

export default combineReducers({
  linkReducer,
  noteReducer,
});
