import { all } from 'redux-saga/effects';

import { sharedSagas } from '../shared/react/store/sharedSaga';
import { testSagas } from './test/testSagas';

export function* sagas() {
  yield all([sharedSagas(), testSagas()]);
}
