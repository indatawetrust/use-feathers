import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types'

const FeathersContext = React.createContext(null);

export const useFeathers = () => useContext(FeathersContext);

export const FeathersProvider = ({ children, client: feathersClient }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

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
  const checkAuth = () => (
    feathersClient
      .get('authentication')
      .then(successfulLogin)
  );

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
  const register = ({ email = '', password = '' }) => (
    feathersClient
      .service('users')
      .create({
        email,
        password
      })
  );

  /*
   * @return {Promise}
   */
  const reAuth = () => (
    feathersClient
      .reAuthenticate()
      .then(() => checkAuth())
  );

  /*
   * @return {Promise}
   */
  const logout = () => (
    feathersClient
      .logout()
      .then(() => setIsLoggedIn(false))
  );

  return (
    <FeathersContext.Provider
      value={{
        checkAuth,
        login,
        register,
        reAuth,
        logout,
        isLoggedIn,
        userInfo,
      }}
    >
      {children}
    </FeathersContext.Provider>
  );
};

FeathersProvider.propTypes = {
  children: PropTypes.element.isRequired,
  client: PropTypes.object.isRequired,
};
