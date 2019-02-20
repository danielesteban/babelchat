import API from '@/services/api';
import * as types from './types';

// eslint-disable-next-line import/prefer-default-export
export function fetch() {
  return {
    type: types.ROOMS_FETCH,
    payload: API.fetch({
      endpoint: 'rooms',
    }),
  };
}
