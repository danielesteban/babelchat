import API from '@/services/api';
import * as types from './types';

export function createRoom({ flag, name, peerLimit }) {
  return (dispatch, getState) => {
    const { org: { id } } = getState();
    return dispatch({
      type: types.ORG_CREATE_ROOM,
      payload: API.fetch({
        body: { flag, name, peerLimit },
        endpoint: `org/${id}/rooms`,
        method: 'PUT',
      }),
    });
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
        endpoint: `org/${id}/rooms`,
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
        endpoint: `org/${id}/users`,
      }),
    });
  };
}

export function removeRoom(slug) {
  return (dispatch, getState) => {
    const { org: { id } } = getState();
    return dispatch({
      type: types.ORG_REMOVE_ROOM,
      payload: API.fetch({
        endpoint: `org/${id}/room/${slug}`,
        method: 'DELETE',
      })
        .then(() => ({ slug })),
    });
  };
}

export function removeUser(user) {
  return (dispatch, getState) => {
    const { org: { id } } = getState();
    return dispatch({
      type: types.ORG_REMOVE_USER,
      payload: API.fetch({
        endpoint: `org/${id}/user/${user}`,
        method: 'DELETE',
      })
        .then(() => ({ user })),
    });
  };
}

export function resolveRequest({ user, resolution }) {
  return (dispatch, getState) => {
    const { org: { id } } = getState();
    return dispatch({
      type: types.ORG_RESOLVE_REQUEST,
      payload: API.fetch({
        endpoint: `org/${id}/user/${user}/${resolution}`,
        method: 'POST',
      })
        .then(() => ({
          user,
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
        endpoint: `org/${id}/users`,
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
      endpoint: 'orgs',
      method: 'PUT',
    }),
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
        method: 'POST',
      }),
    });
  };
}
