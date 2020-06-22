import { deepGet } from '../utils';
import { actionTypes, serviceMethods } from '../constants';

const useGet = ({ dispatch, resetState, feathersClient, state }) => (
  service: string
) => ({
  // inject reducer state
  state: deepGet(state, ['serviceState', service, serviceMethods.GET]),
  resetGetState: () => resetState(service, serviceMethods.GET),
  getAction: (id: string) => {
    dispatch({
      type: actionTypes.PENDING,
      method: serviceMethods.GET,
      service,
    });

    feathersClient
      .service(service)
      .get(id)
      .then((result) => {
        dispatch({
          type: actionTypes.FULFILLED,
          method: serviceMethods.GET,
          service,
          result,
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.REJECTED,
          method: serviceMethods.GET,
          service,
          error,
        });
      });
  },
});

export default useGet;
