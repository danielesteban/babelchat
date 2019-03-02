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

const isShowingCreateRoom = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ORG_SHOW_CREATE_ROOM:
      return true;
    case types.ORG_CREATE_ROOM_FULFILLED:
    case types.ORG_HIDE_CREATE_ROOM:
    case types.ORG_RESET:
      return false;
    default:
      return state;
  }
};

const isShowingUsers = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ORG_SHOW_USERS:
      return true;
    case types.ORG_HIDE_USERS:
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
    case types.ORG_REQUEST_ACCESS_FULFILLED:
      return true;
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

const pendingRequests = (
  state = 0,
  action
) => {
  switch (action.type) {
    case types.ORG_FETCH_USERS_FULFILLED:
      return action.payload.reduce((count, { isRequest }) => (
        count + (isRequest ? 1 : 0)
      ), 0);
    case types.ORG_RESOLVE_REQUEST_FULFILLED:
      return state - 1;
    case types.ORG_RESET:
      return 0;
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
    case types.ORG_CREATE_ROOM_FULFILLED:
      return [
        ...state,
        action.payload,
      ].sort(({ name: a }, { name: b }) => a.localeCompare(b));
    case types.ORG_REMOVE_ROOM_FULFILLED:
      return state.filter(({ slug }) => (slug !== action.payload.slug));
    case types.ORG_RESET:
      return [];
    default:
      return state;
  }
};

const users = (
  state = [],
  action
) => {
  switch (action.type) {
    case types.ORG_FETCH_USERS_FULFILLED:
      return action.payload.sort(({ name: a }, { name: b }) => a.localeCompare(b));
    case types.ORG_RESOLVE_REQUEST_FULFILLED:
      if (action.payload.resolution === 'approve') {
        return state.map((user) => {
          if (user._id === action.payload.id) {
            return {
              ...user,
              isRequest: undefined,
            };
          }
          return user;
        });
      }
      return state.filter(({ _id }) => (_id !== action.payload.id));
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
  isShowingCreateRoom,
  isShowingUsers,
  isSigningup,
  isUser,
  name,
  pendingRequests,
  rooms,
  users,
});

export default orgReducer;
