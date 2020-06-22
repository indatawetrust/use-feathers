import { deepGet } from '../utils';
import { actionTypes, serviceMethods } from '../constants';

const usePatch = ({ dispatch, resetState, feathersClient, state }) => (
  service: string
) => ({
  // inject reducer state
  state: deepGet(state, ['serviceState', service, serviceMethods.PATCH]),
  resetPatchState: () => resetState(service, serviceMethods.PATCH),
  patchAction: (id, data = {}, params = {}) => {
    dispatch({
      type: actionTypes.PENDING,
      method: serviceMethods.PATCH,
      service,
    });

    feathersClient
      .service(service)
      .patch(id, data, params)
      .then((result) => {
        dispatch({
          type: actionTypes.FULFILLED,
          method: serviceMethods.PATCH,
          service,
          result,
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.REJECTED,
          method: serviceMethods.PATCH,
          service,
          error,
        });
      });
  },
});

export default usePatch;
