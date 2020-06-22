import { deepGet } from '../utils';
import { actionTypes, serviceMethods } from '../constants';

const useUpdate = ({ dispatch, resetState, feathersClient, state }) => (
  service: string
) => ({
  // inject reducer state
  state: deepGet(state, ['serviceState', service, serviceMethods.UPDATE]),
  resetUpdateState: () => resetState(service, serviceMethods.UPDATE),
  updateAction: (id: string, params = {}, query = {}) => {
    dispatch({
      type: actionTypes.PENDING,
      method: serviceMethods.UPDATE,
      service,
    });

    feathersClient
      .service(service)
      .update(id, params, { query })
      .then((result) => {
        dispatch({
          type: actionTypes.FULFILLED,
          method: serviceMethods.UPDATE,
          service,
          result,
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.REJECTED,
          method: serviceMethods.UPDATE,
          service,
          error,
        });
      });
  },
});

export default useUpdate;
