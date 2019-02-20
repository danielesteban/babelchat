import { createBrowserHistory, createHashHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore, compose as productionCompose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { Router } from 'react-router-dom';
import thunkMiddleware from 'redux-thunk';
import { refresh as refreshToken } from '@/actions/session';
import syncTranslationWithStore, { load as reloadLocales } from '@/locales';
import rootReducer from '@/reducers';
import Root from '@/routes';

const devCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const compose = !__PRODUCTION__ && devCompose ? devCompose : productionCompose;
const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(thunkMiddleware, promiseMiddleware, loadingBarMiddleware())
  )
);
syncTranslationWithStore(store);

if (store.getState().session.isAuth) {
  store.dispatch(refreshToken());
}

let history;
if (window.process && window.process.type) {
  history = createHashHistory();
} else {
  history = createBrowserHistory({
    basename: __BASENAME__,
  });
}

const mount = document.getElementById('mount');
render(
  <Provider store={store}>
    <Router history={history}>
      <Root />
    </Router>
  </Provider>,
  mount
);

if (!__PRODUCTION__ && module.hot) {
  module.hot.accept('@/locales', () => reloadLocales(store));
  module.hot.accept('@/reducers', () => store.replaceReducer(rootReducer));
}
