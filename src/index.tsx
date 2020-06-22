import React, {
  useContext,
  useState,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import reducer from './reducer';
import { actionTypes, serviceMethods } from './constants';
import mainHook from './hooks';

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

  const {
    useFind,
    useGet,
    useCreate,
    useUpdate,
    usePatch,
    useRemove,
  } = mainHook({
    dispatch, resetState, feathersClient, state
  })

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
