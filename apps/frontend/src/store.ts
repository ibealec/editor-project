import { createStore } from 'redux';
import linkReducer from './reducer';
let store = createStore(linkReducer);

export default store;
