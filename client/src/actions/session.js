import { setLocale as reduxSetLocale } from 'react-redux-i18n';
import API from '@/services/api';
import * as types from './types';

export function refresh(session) {
  if (session) {
    return {
      type: types.SESSION_REFRESH_FULFILLED,
      payload: session,
    };
  }
  return dispatch => dispatch({
    type: types.SESSION_REFRESH,
    payload: API.fetch({
      endpoint: 'user',
    }),
  }).catch(() => {});
}

export function setLocale(locale) {
  return (dispatch) => {
    localStorage.setItem('BABELCHAT::LOCALE', locale);
    dispatch(reduxSetLocale(locale));
  };
}

export function signout() {
  return {
    type: types.SESSION_SIGNOUT,
  };
}
