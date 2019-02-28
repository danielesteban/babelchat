import API from '@/services/api';
import * as types from './types';

export function hideSignup() {
  return {
    type: types.ORG_HIDE_SIGNUP,
  };
}

export function fetch(slug) {
  return {
    type: types.ORG_FETCH,
    payload: API.fetch({
      endpoint: `org/${slug}`,
    }),
  };
}

export function fetchRooms() {
  return (dispatch, getState) => {
    const { org: { id } } = getState();
    dispatch({
      type: types.ORG_FETCH_ROOMS,
      payload: API.fetch({
        endpoint: `rooms/${id}`,
      }),
    });
  };
}

export function reset() {
  return {
    type: types.ORG_RESET,
  };
}

export function signup({ name }) {
  return {
    type: types.ORG_SIGNUP,
    payload: API.fetch({
      body: {
        name,
      },
      endpoint: 'org',
      method: 'PUT',
    }),
  };
}

export function showSignup() {
  return {
    type: types.ORG_SHOW_SIGNUP,
  };
}

export function updateImage({ image, blob }) {
  return (dispatch, getState) => {
    const { org: { id } } = getState();
    const body = new FormData();
    body.append('image', blob);
    return dispatch({
      type: types.ORG_UPDATE_IMAGE,
      payload: API.fetch({
        body,
        endpoint: `org/${id}/${image}`,
        method: 'PUT',
      }),
    });
  };
}
