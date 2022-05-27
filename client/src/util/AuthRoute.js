import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);
  console.log('user', user);
  if (user.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
    return <Redirect to="/" />
  } else{
    return (
      <Route
        {...rest}
        render={(props) =>
          <Component {...props} />
        }
      />
    );
  }
  
}

export default AuthRoute;
