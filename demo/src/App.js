import React, { useState, useEffect } from 'react';
import './App.css';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useFeathers } from '@cond/use-feathers';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import { Navbar, NavbarBrand, NavbarText, Button } from 'reactstrap';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useFeathers();

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

function App() {
  const [wait, setWait] = useState(true);
  const { userInfo, reAuth, logout, isLoggedIn } = useFeathers();
  const history = useHistory();

  useEffect(() => {
    reAuth()
      .catch(() => {})
      .finally(() => {
        setWait(false);
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      history.push('/');
    }
  }, [isLoggedIn]);

  if (wait)
    return (
      <div id="center-area">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <>
      <Navbar>
        <NavbarBrand href="/">app</NavbarBrand>
        {isLoggedIn && (
          <NavbarText>
            <span className="mr-2">{userInfo?.email}</span>
            <Button onClick={logout} size="sm">
              logout
            </Button>
          </NavbarText>
        )}
      </Navbar>
      <Switch>
        <PrivateRoute path="/" component={Home} exact />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </>
  );
}

export default App;
