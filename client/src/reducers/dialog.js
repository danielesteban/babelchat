import * as types from '@/actions/types';

export default (
  state = {},
  action
) => {
  switch (action.type) {
    case types.DIALOG_SHOW:
      return {
        ...state,
        [action.payload.id]: true,
      };
    case types.DIALOG_HIDE:
      return {
        ...state,
        [action.payload.id]: false,
      };
    default:
      return state;
  }
};
