import { multiDeepSet, deepGet } from './utils';
import { actionTypes, serviceMethods } from './constants';

const reducer = (idFieldName: string) => (state, action) => {
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
    case actionTypes.RESET:
      return multiDeepSet(state, [
        [['serviceState', action.service, action.method, 'error'], null],
        [['serviceState', action.service, action.method, 'isLoaded'], false],
        [['serviceState', action.service, action.method, 'isPending'], false],
        [['serviceState', action.service, action.method, 'data'], null],
      ]);
    case actionTypes.INITIAL_SERVICES:
      return {
        ...state,
        serviceState: action.initialServiceState,
      };
    case actionTypes.CREATED:
      return multiDeepSet(state, [
        [
          ['serviceState', action.service, serviceMethods.FIND, 'data', 'data'],
          [
            ...deepGet(state, [
              'serviceState',
              action.service,
              serviceMethods.FIND,
              'data',
              'data',
            ]),
            action.data,
          ],
        ],
        [
          [
            'serviceState',
            action.service,
            serviceMethods.FIND,
            'data',
            'total',
          ],
          (deepGet(state, [
            'serviceState',
            action.service,
            serviceMethods.FIND,
            'data',
            'total',
          ]) || 0) + 1,
        ],
      ]);
    case actionTypes.REMOVED:
      return multiDeepSet(state, [
        [
          ['serviceState', action.service, serviceMethods.FIND, 'data', 'data'],
          [
            ...deepGet(state, [
              'serviceState',
              action.service,
              serviceMethods.FIND,
              'data',
              'data',
            ]).filter((item: object) => item[idFieldName] !== action.data[idFieldName]),
          ],
        ],
        [
          [
            'serviceState',
            action.service,
            serviceMethods.FIND,
            'data',
            'total',
          ],
          deepGet(state, [
            'serviceState',
            action.service,
            serviceMethods.FIND,
            'data',
            'total',
          ]) - 1,
        ],
      ]);
    case actionTypes.UPDATED:
    case actionTypes.PATCHED:
      return multiDeepSet(state, [
        [
          ['serviceState', action.service, serviceMethods.FIND, 'data', 'data'],
          [
            ...deepGet(state, [
              'serviceState',
              action.service,
              serviceMethods.FIND,
              'data',
              'data',
            ]).map((item: object) => {
              if (item[idFieldName] === action.data[idFieldName]) {
                return action.data;
              }
              return item;
            }),
          ],
        ],
      ]);
    default:
      throw new Error();
  }
};

export default reducer;
