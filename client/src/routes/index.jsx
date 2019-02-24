import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Route as RouteComponent, Redirect, Switch } from 'react-router-dom';
import Layout from '@/layout';
import Room from './room';
import Rooms from './rooms';
import Login from './login';
import NotFound from './404';

const Route = connect(
  ({ user: { isAuth } }) => ({ isAuth })
)(({
  component: Component,
  isAuth,
  requiresAuth,
  requiresNoAuth,
  ...rest
}) => {
  const isForbidden = (
    (requiresAuth && !isAuth)
    || (requiresNoAuth && isAuth)
  );
  return (
    <RouteComponent
      {...rest}
      render={props => (
        (isForbidden) ? (
          <Redirect to={isAuth ? '/' : '/login'} />
        ) : (
          <Component {...props} />
        )
      )}
    />
  );
});

const Root = () => (
  <Layout>
    <Switch>
      <Route exact path="/404" component={NotFound} />
      <Route exact path="/login" component={Login} requiresNoAuth />
      <Route exact path="/rooms" component={Rooms} requiresAuth />
      <Route exact path="/:slug" component={Room} requiresAuth />
      <Redirect exact from="/" to="/rooms" />
      <Route path="*" component={NotFound} />
    </Switch>
  </Layout>
);

export default hot(module)(Root);
