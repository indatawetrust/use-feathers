import { deepGet } from '../utils';
import { actionTypes, serviceMethods } from '../constants';

const useCreate = ({ dispatch, resetState, feathersClient, state }) => (
  service: string
) => ({
  // inject reducer state
  state: deepGet(state, ['serviceState', service, serviceMethods.CREATE]),
  resetCreateState: () => resetState(service, serviceMethods.CREATE),
  createAction: (data, params) => {
    dispatch({
      type: actionTypes.PENDING,
      method: serviceMethods.CREATE,
      service,
    });

    feathersClient
      .service(service)
      .create(data, params)
      .then((result) => {
        dispatch({
          type: actionTypes.FULFILLED,
          method: serviceMethods.CREATE,
          service,
          result,
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.REJECTED,
          method: serviceMethods.CREATE,
          service,
          error,
        });
      });
  },
});

export default useCreate;
