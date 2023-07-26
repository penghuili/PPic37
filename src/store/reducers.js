import { combineReducers } from 'redux';

import { sharedReducer } from '../shared/react/store/sharedReducer';
import { testReducer } from './test/testReducer';

export const reducers = combineReducers({
  shared: sharedReducer,
  test: testReducer,
});
