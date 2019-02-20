import { combineReducers } from 'redux';
import * as types from '@/actions/types';

const list = (
  state = [],
  action
) => {
  switch (action.type) {
    case types.ROOMS_FETCH_FULFILLED:
      return action.payload.sort(({ name: a }, { name: b }) => a.localeCompare(b));
    default:
      return state;
  }
};

const roomsReducer = combineReducers({
  list,
});

export default roomsReducer;
