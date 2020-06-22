import { deepGet } from '../utils';
import { actionTypes, serviceMethods } from '../constants';

const useFind = ({ dispatch, resetState, feathersClient, state }) => (
  service: string
) => ({
  // inject reducer state
  state: deepGet(state, ['serviceState', service, serviceMethods.FIND]),
  resetFindState: () => resetState(service, serviceMethods.FIND),
  findAction: (query = {}) => {
    dispatch({
      type: actionTypes.PENDING,
      method: serviceMethods.FIND,
      service,
    });

    feathersClient
      .service(service)
      .find({
        query,
      })
      .then((result) => {
        dispatch({
          type: actionTypes.FULFILLED,
          method: serviceMethods.FIND,
          service,
          result,
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.REJECTED,
          method: serviceMethods.FIND,
          service,
          error,
        });
      });
  },
});

export default useFind;
