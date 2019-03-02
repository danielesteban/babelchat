import API from '@/services/api';
import * as types from './types';

export function hideSignup() {
  return {
    type: types.ORG_HIDE_SIGNUP,
  };
}

export function hideUsers() {
  return {
    type: types.ORG_HIDE_USERS,
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
    return dispatch({
      type: types.ORG_FETCH_ROOMS,
      payload: API.fetch({
        endpoint: `rooms/${id}`,
      }),
    });
  };
}

export function fetchUsers() {
  return (dispatch, getState) => {
    const { org: { id } } = getState();
    return dispatch({
      type: types.ORG_FETCH_USERS,
      payload: API.fetch({
        endpoint: `users/${id}`,
      }),
    });
  };
}

export function removeRoom(slug) {
  return (dispatch, getState) => {
    const { org: { id: org } } = getState();
    return dispatch({
      type: types.ORG_REMOVE_ROOM,
      payload: API.fetch({
        endpoint: `room/${org}/${slug}`,
        method: 'DELETE',
      })
        .then(() => ({ slug })),
    });
  };
}

export function resolveRequest({ id, resolution }) {
  return (dispatch, getState) => {
    const { org: { id: org } } = getState();
    return dispatch({
      type: types.ORG_RESOLVE_REQUEST,
      payload: API.fetch({
        endpoint: `user/${org}/${id}/${resolution}`,
        method: 'POST',
      })
        .then(() => ({
          id,
          resolution,
        })),
    });
  };
}

export function requestAccess() {
  return (dispatch, getState) => {
    const { org: { id } } = getState();
    return dispatch({
      type: types.ORG_REQUEST_ACCESS,
      payload: API.fetch({
        endpoint: `users/${id}`,
        method: 'PUT',
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

export function showUsers() {
  return {
    type: types.ORG_SHOW_USERS,
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
