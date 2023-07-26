export const testActionTypes = {
  IS_LOADING: 'test/IS_LOADING',
};

export const testActionCreators = {
  isLoading(value) {
    return { type: testActionTypes.IS_LOADING, payload: { value } };
  },
};
