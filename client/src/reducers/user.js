import { combineReducers } from 'redux';
import * as types from '@/actions/types';
import API from '@/services/api';
import WaitForFirstInteraction from '@/services/firstInteraction';

const localStoreKeyPrefix = 'BABELCHAT::';
const sessionKey = `${localStoreKeyPrefix}SESSION`;
const storedSession = JSON.parse(
  localStorage.getItem(sessionKey) || 'false'
);
if (storedSession) {
  API.setAuthorization(storedSession.token);
}

const isAudioMuted = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.USER_TOGGLE_AUDIO:
      return !state;
    default:
      return state;
  }
};

const isAuth = (
  state = !!storedSession,
  action
) => {
  switch (action.type) {
    case types.USER_REFRESH_SESSION_FULFILLED:
      return true;
    case types.USER_REFRESH_SESSION_REJECTED:
    case types.USER_SIGNOUT:
      return false;
    default:
      return state;
  }
};

const isShowingSettings = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.USER_HIDE_SETTINGS:
      return false;
    case types.USER_SHOW_SETTINGS:
      return true;
    default:
      return state;
  }
};

const profile = (
  state = storedSession ? storedSession.profile : {},
  action
) => {
  switch (action.type) {
    case types.USER_REFRESH_SESSION_FULFILLED:
      return action.payload.profile;
    case types.USER_REFRESH_SESSION_REJECTED:
    case types.USER_SIGNOUT:
      return {};
    default:
      return state;
  }
};

const settings = (
  state = {
    audioInput: localStorage.getItem(`${localStoreKeyPrefix}audioInput`) || '',
    videoInput: localStorage.getItem(`${localStoreKeyPrefix}videoInput`) || '',
  },
  action
) => {
  switch (action.type) {
    case types.USER_SAVE_SETTINGS: {
      const { audioInput, videoInput } = action.payload;
      localStorage.setItem(`${localStoreKeyPrefix}audioInput`, audioInput || '');
      localStorage.setItem(`${localStoreKeyPrefix}videoInput`, videoInput || '');
      return {
        audioInput,
        videoInput,
      };
    }
    default:
      return state;
  }
};

const stream = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.USER_START_STREAM:
      return action.payload.stream;
    case types.ROOM_RESET:
      if (state) {
        state.getTracks()
          .forEach(track => track.stop());
      }
      return false;
    case types.USER_TOGGLE_AUDIO:
      if (state) {
        state.getAudioTracks()
          .forEach((track) => { track.enabled = !track.enabled; });
      }
      return state;
    default:
      return state;
  }
};

const token = (
  state = storedSession ? storedSession.token : '',
  action
) => {
  switch (action.type) {
    case types.USER_REFRESH_SESSION_FULFILLED:
      API.setAuthorization(action.payload.token);
      localStorage.setItem(sessionKey, JSON.stringify(action.payload));
      return action.payload.token;
    case types.USER_REFRESH_SESSION_REJECTED:
    case types.USER_SIGNOUT:
      API.setAuthorization(false);
      localStorage.removeItem(sessionKey);
      return '';
    default:
      return state;
  }
};

const video = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.USER_START_STREAM: {
      const video = document.createElement('video');
      video.muted = true;
      video.srcObject = action.payload.stream;
      video.onloadedmetadata = () => (
        WaitForFirstInteraction()
          .then(() => video.play())
      );
      return video;
    }
    case types.ROOM_RESET:
      if (state) {
        state.srcObject = null;
      }
      return false;
    default:
      return state;
  }
};

const userReducer = combineReducers({
  isAudioMuted,
  isAuth,
  isShowingSettings,
  profile,
  settings,
  stream,
  token,
  video,
});

export default userReducer;
