import { combineReducers } from 'redux';

import { sharedReducer } from '../shared/react/store/sharedReducer';
import { picDomain, picReducer } from './pic/picStore';

export const reducers = combineReducers({
  shared: sharedReducer,
  [picDomain]: picReducer
});
