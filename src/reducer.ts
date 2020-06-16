import { multiDeepSet } from './utils';
import { actionTypes } from './constants';

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.PENDING:
      return multiDeepSet(state, [
        [['serviceState', action.service, action.method, 'isPending'], true],
        [['serviceState', action.service, action.method, 'error'], null],
        [['serviceState', action.service, action.method, 'isLoaded'], false],
      ]);
    case actionTypes.FULFILLED:
      return multiDeepSet(state, [
        [
          ['serviceState', action.service, action.method, 'data'],
          action.result,
        ],
        [['serviceState', action.service, action.method, 'isLoaded'], true],
        [['serviceState', action.service, action.method, 'isPending'], false],
        [['serviceState', action.service, action.method, 'error'], null],
      ]);
    case actionTypes.REJECTED:
      return multiDeepSet(state, [
        [
          ['serviceState', action.service, action.method, 'error'],
          action.error,
        ],
        [['serviceState', action.service, action.method, 'isLoaded'], true],
        [['serviceState', action.service, action.method, 'isPending'], false],
      ]);
    case actionTypes.INITIAL_SERVICES:
      return {
        ...state,
        serviceState: action.initialServiceState,
      };
    default:
      throw new Error();
  }
};

export default reducer;
