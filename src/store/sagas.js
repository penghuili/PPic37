import { all } from 'redux-saga/effects';

import { sharedSagas } from '../shared/react/store/sharedSaga';
import { picSagas } from './pic/picStore';

export function* sagas() {
  yield all([sharedSagas(), picSagas()]);
}
