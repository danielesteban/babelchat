import { combineReducers } from 'redux';
import { i18nReducer as i18n } from 'react-redux-i18n';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import room from './room';
import rooms from './rooms';
import user from './user';

const rootReducer = combineReducers({
  i18n,
  loadingBar,
  room,
  rooms,
  user,
});

export default rootReducer;
