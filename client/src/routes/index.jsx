import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Route as RouteComponent, Redirect, Switch } from 'react-router-dom';
import Layout from '@/layout';
import Landing from './landing';
import NotFound from './404';
import Org from './org';
import Room from './room';

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
          <Redirect to="/" />
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
      <Route exact path="/" component={Landing} />
      <Route exact path="/404" component={NotFound} />
      <Route exact path="/:org/:slug" component={Room} requiresAuth />
      <Route exact path="/:slug" component={Org} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Layout>
);

export default hot(module)(Root);
