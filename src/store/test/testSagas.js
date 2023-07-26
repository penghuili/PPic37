import { all, call, fork, takeLatest } from 'redux-saga/effects';

import { sharedActionTypes } from '../../shared/react/store/sharedActions';

function* init() {
  yield call(console.log, 'init');
}

function* handleIsLoggedIn({ payload: { loggedIn } }) {
  yield call(console.log, 'handleIsLoggedIn', loggedIn);
}

export function* testSagas() {
  yield fork(init);

  yield all([takeLatest(sharedActionTypes.IS_LOGGED_IN, handleIsLoggedIn)]);
}
