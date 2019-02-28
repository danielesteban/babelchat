import { combineReducers } from 'redux';
import * as types from '@/actions/types';

const hasLoaded = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ORG_FETCH_FULFILLED:
      return true;
    case types.ORG_RESET:
      return false;
    default:
      return state;
  }
};

const id = (
  state = '',
  action
) => {
  switch (action.type) {
    case types.ORG_FETCH_FULFILLED:
      return action.payload._id;
    case types.ORG_RESET:
      return '';
    default:
      return state;
  }
};

const isActive = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ORG_FETCH_FULFILLED:
      return action.payload.isActive || false;
    case types.ORG_RESET:
      return false;
    default:
      return state;
  }
};

const isAdmin = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ORG_FETCH_FULFILLED:
      return action.payload.isAdmin || false;
    case types.ORG_RESET:
      return false;
    default:
      return state;
  }
};

const isSigningup = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ORG_SHOW_SIGNUP:
      return true;
    case types.ORG_HIDE_SIGNUP:
      return false;
    default:
      return state;
  }
};

const isUser = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ORG_FETCH_FULFILLED:
      return action.payload.isUser || false;
    case types.ORG_RESET:
      return false;
    default:
      return state;
  }
};

const name = (
  state = '',
  action
) => {
  switch (action.type) {
    case types.ORG_FETCH_FULFILLED:
      return action.payload.name;
    case types.ORG_RESET:
      return '';
    default:
      return state;
  }
};

const rooms = (
  state = [],
  action
) => {
  switch (action.type) {
    case types.ORG_FETCH_ROOMS_FULFILLED:
      return action.payload.sort(({ name: a }, { name: b }) => a.localeCompare(b));
    case types.ORG_RESET:
      return [];
    default:
      return state;
  }
};

const orgReducer = combineReducers({
  hasLoaded,
  id,
  isActive,
  isAdmin,
  isSigningup,
  isUser,
  name,
  rooms,
});

export default orgReducer;
