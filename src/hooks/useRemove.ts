import { deepGet } from '../utils';
import { actionTypes, serviceMethods } from '../constants';

const useRemove = ({ dispatch, resetState, feathersClient, state }) => (
  service: string
) => ({
  // inject reducer state
  state: deepGet(state, ['serviceState', service, serviceMethods.REMOVE]),
  resetRemoveState: () => resetState(service, serviceMethods.REMOVE),
  removeAction: (id, query = {}) => {
    dispatch({
      type: actionTypes.PENDING,
      method: serviceMethods.REMOVE,
      service,
    });

    feathersClient
      .service(service)
      .remove(id, { query })
      .then((result) => {
        dispatch({
          type: actionTypes.FULFILLED,
          method: serviceMethods.REMOVE,
          service,
          result,
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.REJECTED,
          method: serviceMethods.REMOVE,
          service,
          error,
        });
      });
  },
});

export default useRemove;
