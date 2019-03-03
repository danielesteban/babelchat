import { setLocale as reduxSetLocale } from 'react-redux-i18n';
import * as types from './types';
import API from '@/services/api';

export function fetchOrgs() {
  return {
    type: types.USER_FETCH_ORGS,
    payload: API.fetch({
      endpoint: 'user/orgs',
    }),
  };
}

export function refreshSession(session) {
  if (session) {
    return {
      type: types.USER_REFRESH_SESSION_FULFILLED,
      payload: session,
    };
  }
  return dispatch => dispatch({
    type: types.USER_REFRESH_SESSION,
    payload: API.fetch({
      endpoint: 'user',
    }),
  }).catch(() => {});
}

export function saveSettings({ audioInput, videoInput }) {
  return {
    type: types.USER_SAVE_SETTINGS,
    payload: { audioInput, videoInput },
  };
}

export function setLocale(locale) {
  return (dispatch) => {
    localStorage.setItem('BABELCHAT::LOCALE', locale);
    dispatch(reduxSetLocale(locale));
  };
}

export function signout() {
  return {
    type: types.USER_SIGNOUT,
  };
}

export function startStream(stream) {
  return (dispatch, getState) => {
    const { user: { isAudioMuted } } = getState();
    if (isAudioMuted) {
      stream.getAudioTracks()
        .forEach((track) => { track.enabled = false; });
    }
    dispatch({
      type: types.USER_START_STREAM,
      payload: { stream },
    });
  };
}

export function toggleAudio() {
  return {
    type: types.USER_TOGGLE_AUDIO,
  };
}
