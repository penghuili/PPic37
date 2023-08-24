import { call, put, select, take } from 'redux-saga/effects';

import { safeGet, safeSet } from '../../shared/js/object';
import { sharedActionCreators } from '../../shared/react/store/sharedActions';
import {
  createDataSelectors,
  createGeneralStore,
  createRequest,
  mergeReducers,
  mergeSagas,
} from '../../shared/react/store/storeHelpers';
import { createPic, deletePic, downloadFile, fetchPics, updatePic, uploadFile } from './picNetwork';

export const picDomain = 'pic';

const dataSelectors = createDataSelectors(picDomain);

function* makeSurePicIsFetched(picId) {
  let pic = yield select(dataSelectors.getItem, undefined, picId);
  if (!pic) {
    yield put({ type: `${picDomain}/fetchItems/REQUESTED` });
    yield take(`${picDomain}/fetchItems/SUCCEEDED`);
    pic = yield select(dataSelectors.getItem, undefined, picId);
  }

  return pic;
}

const { actions, selectors, reducer, saga } = createGeneralStore(picDomain, {
  preFetchItems: function* () {
    const pics = yield select(dataSelectors.getItems);
    return { continueCall: !pics.length };
  },
  fetchItems: async () => {
    return fetchPics();
  },
  createItem: function* ({ file, date, note, links }) {
    const { data: fileMeta, error } = yield call(uploadFile, file);

    if (!fileMeta) {
      return { data: null, error };
    }

    yield put(sharedActionCreators.setToast('Image is uploaded.'));

    const result = yield call(createPic, {
      encryptedPassword: fileMeta.encryptedPassword,
      password: fileMeta.password,
      fileId: fileMeta.sortKey,
      date,
      note,
      links,
    });

    if (result.data) {
      yield put(sharedActionCreators.setToast('Profile pic is created.'));
    }

    return result;
  },
  preUpdateItem: function* ({ itemId }) {
    let pic = yield call(makeSurePicIsFetched, itemId);
    return { continueCall: !!pic, result: pic };
  },
  updateItem: async ({ itemId, note, links }, pic) => {
    return updatePic(itemId, { note, links }, pic.decryptedPassword);
  },
  deleteItem: async ({ pic }) => {
    return deletePic(pic);
  },
});

const getFile = (state, fileId) => {
  return safeGet(state, [picDomain, 'data', 'files', fileId]);
};

const {
  actions: fetchFileActions,
  selectors: fetchFileSelectors,
  reducer: fetchFileReducer,
  saga: fetchFileSaga,
} = createRequest(picDomain, 'fetchFile', {
  watchEvery: true,
  onReducerSucceeded: (state, { payload, data }) => {
    const newState = safeSet(state, ['data', 'files', payload.fileId], data);
    return newState;
  },
  preRequest: function* ({ fileId }) {
    const file = yield select(getFile, fileId);
    return { continueCall: !file };
  },
  request: async ({ fileId }) => {
    return downloadFile(fileId);
  },
});

export const picActions = {
  fetchItemsRequested: actions.fetchItems.requested.action,
  fetchItemRequested: actions.fetchItem.requested.action,
  createRequested: actions.createItem.requested.action,
  updateRequested: actions.updateItem.requested.action,
  deleteRequested: actions.deleteItem.requested.action,
  fetchFileRequested: fetchFileActions.requested.action,
};

export const picSelectors = {
  ...selectors,
  fetchFile: fetchFileSelectors,
  data: { ...dataSelectors, getFile },
};

export const picReducer = mergeReducers([reducer, fetchFileReducer]);

export const picSagas = mergeSagas([saga, fetchFileSaga]);
