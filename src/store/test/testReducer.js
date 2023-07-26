import { sharedActionTypes } from '../../shared/react/store/sharedActions';
import { testActionTypes } from './testActions';

const initialState = {
  isLoading: false,
};

function handleIsLoading(state, { value }) {
  return { ...state, isLoading: value };
}

function handleReset() {
  return initialState;
}

export function testReducer(state = initialState, action) {
  switch (action.type) {
    case testActionTypes.IS_LOADING:
      return handleIsLoading(state, action.payload);

    case sharedActionTypes.RESET:
      return handleReset();

    default:
      return state;
  }
}
