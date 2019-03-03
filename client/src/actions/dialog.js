import * as types from './types';

export function hide(id) {
  return {
    type: types.DIALOG_HIDE,
    payload: { id },
  };
}

export function show(id) {
  return {
    type: types.DIALOG_SHOW,
    payload: { id },
  };
}
