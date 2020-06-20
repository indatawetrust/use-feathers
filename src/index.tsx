import React, {
  useContext,
  useState,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import reducer from './reducer';
import { deepGet } from './utils';
import { actionTypes, serviceMethods } from './constants';

const FeathersContext = React.createContext(null);

export const useFeathers = () => useContext(FeathersContext);

const initialState = {};

export const FeathersProvider = ({
  children,
  client: feathersClient,
  initialServices = [],
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialServiceState = {};

    const serviceState = {
      [serviceMethods.FIND]: {
        isPending: false,
        isLoaded: false,
        error: null,
        data: {
          total: 0,
          limit: 10,
          skip: 0,
          data: [],
        },
      },
      [serviceMethods.GET]: {
        isPending: false,
        isLoaded: false,
        error: null,
        data: null,
      },
      [serviceMethods.CREATE]: {
        isPending: false,
        isLoaded: false,
        error: null,
        data: null,
      },
      [serviceMethods.UPDATE]: {
        isPending: false,
        isLoaded: false,
        error: null,
        data: null,
      },
      [serviceMethods.PATCH]: {
        isPending: false,
        isLoaded: false,
        error: null,
        data: null,
      },
      [serviceMethods.REMOVE]: {
        isPending: false,
        isLoaded: false,
        error: null,
        data: null,
      },
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const service of initialServices) {
      initialServiceState[service] = serviceState;
    }

    dispatch({ type: actionTypes.INITIAL_SERVICES, initialServiceState });
  }, []);

  /*
   * @param data
   * @param data.user
   * @param data.accessToken
   * @return {Object}
   */
  const successfulLogin = (data) => {
    const { user } = data;

    setIsLoggedIn(true);
    setUserInfo(user);

    return data;
  };

  /*
   * @return {Promise}
   */
  const checkAuth = () =>
    feathersClient.get('authentication').then(successfulLogin);

  /*
   * @param loginInfo
   * @param loginInfo.email    user email
   * @param loginInfo.password user password
   * @return {Promise}
   */
  const login = ({ email = '', password = '' }) => (
    feathersClient
      .authenticate({
        strategy: 'local',
        email,
        password,
      })
      .then(successfulLogin)
  );

  /*
   * @param registerInfo
   * @param registerInfo.email    user email
   * @param registerInfo.password user password
   * @return {Promise}
   */
  const register = ({ email = '', password = '', ...otherFields }) => (
    feathersClient.service('users').create({
      email,
      password,
      ...otherFields,
    })
  );

  /*
   * @return {Promise}
   */
  const reAuth = () => feathersClient.reAuthenticate().then(() => checkAuth());

  /*
   * @return {Promise}
   */
  const logout = () => feathersClient.logout().then(() => setIsLoggedIn(false));

  const resetState = (service: string, method: string) => (
    dispatch({
      type: actionTypes.RESET,
      method,
      service,
    })
  );

  const useFind = (service: string) => ({
    // inject reducer state
    state: deepGet(state, ['serviceState', service, serviceMethods.FIND]),
    resetFindState: resetState(service, serviceMethods.FIND),
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
  const useGet = (service: string) => ({
    // inject reducer state
    state: deepGet(state, ['serviceState', service, serviceMethods.GET]),
    resetGetState: resetState(service, serviceMethods.GET),
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
  const useCreate = (service: string) => ({
    // inject reducer state
    state: deepGet(state, ['serviceState', service, serviceMethods.CREATE]),
    resetCreateState: resetState(service, serviceMethods.CREATE),
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
  const useUpdate = (service: string) => ({
    // inject reducer state
    state: deepGet(state, ['serviceState', service, serviceMethods.UPDATE]),
    resetUpdateState: resetState(service, serviceMethods.UPDATE),
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
  const usePatch = (service: string) => ({
    // inject reducer state
    state: deepGet(state, ['serviceState', service, serviceMethods.PATCH]),
    resetPatchState: resetState(service, serviceMethods.PATCH),
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
  const useRemove = (service: string) => ({
    // inject reducer state
    state: deepGet(state, ['serviceState', service, serviceMethods.REMOVE]),
    resetRemoveState: resetState(service, serviceMethods.REMOVE),
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

  const value = {
    checkAuth,
    login,
    register,
    reAuth,
    logout,
    isLoggedIn,
    userInfo,
    mainState: state,
    useFind,
    useGet,
    useCreate,
    useUpdate,
    usePatch,
    useRemove,
  };

  return (
    <FeathersContext.Provider
      value={value}
    >
      {children}
    </FeathersContext.Provider>
  );
};

FeathersProvider.propTypes = {
  children: PropTypes.element.isRequired,
  client: PropTypes.object.isRequired,
  initialServices: PropTypes.arrayOf(PropTypes.string),
};

FeathersProvider.defaultProps = {
  initialServices: [],
};
