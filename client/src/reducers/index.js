import { combineReducers } from 'redux';
import { i18nReducer as i18n } from 'react-redux-i18n';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import org from './org';
import room from './room';
import user from './user';

const rootReducer = combineReducers({
  i18n,
  loadingBar,
  org,
  room,
  user,
});

export default rootReducer;
