import { Action } from 'redux';
import { Descendant } from 'slate';

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

export interface Note {
  id: string;
  title: string;
  content: Array<Descendant>;
}
