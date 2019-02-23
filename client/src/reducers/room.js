import { combineReducers } from 'redux';
import * as types from '@/actions/types';
import WaitForFirstInteraction from '@/services/firstInteraction';

const name = (
  state = '',
  action
) => {
  switch (action.type) {
    case types.ROOM_JOIN:
      return action.payload.name;
    case types.ROOM_RESET:
      return '';
    default:
      return state;
  }
};

const peers = (
  state = [],
  action
) => {
  switch (action.type) {
    case types.ROOM_JOIN:
      state.forEach(({ connection }) => (
        connection.destroy()
      ));
      return action.payload.peers;
    case types.ROOM_PEER_JOIN:
      return [
        ...state,
        action.payload.peer,
      ];
    case types.ROOM_PEER_LEAVE:
      return state.filter(
        ({ connection, peer }) => {
          if (peer === action.payload.peer) {
            connection.destroy();
            return true;
          }
          return false;
        }
      );
    case types.ROOM_PEER_SIGNAL:
      state.forEach(({ connection, peer }) => {
        if (peer === action.payload.peer) {
          connection.signal(action.payload.signal);
        }
      });
      return state;
    case types.ROOM_PEER_STREAM:
      return state.map(
        (peer) => {
          if (peer.peer === action.payload.peer) {
            const video = document.createElement('video');
            video.srcObject = action.payload.stream;
            video.onloadedmetadata = () => (
              WaitForFirstInteraction()
                .then(() => video.play())
            );
            return {
              ...peer,
              video,
            };
          }
          return peer;
        }
      );
    case types.ROOM_STREAM_START:
      state.forEach(({ connection }) => {
        connection.addStream(action.payload.stream);
      });
      return state;
    case types.ROOM_RESET:
      state.forEach(({ connection }) => (
        connection.destroy()
      ));
      return [];
    default:
      return state;
  }
};

const photos = (
  state = [],
  action
) => {
  switch (action.type) {
    case types.ROOM_JOIN:
      return action.payload.photos;
    case types.ROOM_ADD_PHOTO:
      return [
        ...state,
        action.payload,
      ];
    case types.ROOM_MOVE_PHOTO:
      return state.map((photo) => {
        if (photo._id === action.payload.photo) {
          return {
            ...photo,
            origin: {
              x: action.payload.origin.x,
              y: action.payload.origin.y,
            },
          };
        }
        return photo;
      });
    case types.ROOM_REMOVE_PHOTO:
      return state.filter(({ _id }) => (_id !== action.payload.photo));
    case types.ROOM_RESET:
      return [];
    default:
      return state;
  }
};

const socket = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ROOM_JOIN:
      return action.payload.socket;
    case types.ROOM_RESET:
      return false;
    default:
      return state;
  }
};

const stream = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ROOM_STREAM_START:
      return action.payload.stream;
    case types.ROOM_RESET:
      if (state) {
        state.getTracks().forEach(track => track.stop());
      }
      return false;
    default:
      return state;
  }
};

const video = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.ROOM_STREAM_START: {
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

const roomReducer = combineReducers({
  name,
  peers,
  photos,
  socket,
  stream,
  video,
});

export default roomReducer;
