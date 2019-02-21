import * as types from './types';

export function addPhoto({ _id, origin, photo }) {
  return {
    type: types.ROOM_ADD_PHOTO,
    payload: { _id, origin, photo },
  };
}

export function join({ meta, peers, socket }) {
  return {
    type: types.ROOM_JOIN,
    payload: { meta, peers, socket },
  };
}

export function peerJoin(peer) {
  return {
    type: types.ROOM_PEER_JOIN,
    payload: { peer },
  };
}

export function peerLeave({ peer }) {
  return {
    type: types.ROOM_PEER_LEAVE,
    payload: { peer },
  };
}

export function peerSignal({ peer, signal }) {
  return {
    type: types.ROOM_PEER_SIGNAL,
    payload: { peer, signal },
  };
}

export function peerStream({ peer, stream }) {
  return {
    type: types.ROOM_PEER_STREAM,
    payload: { peer, stream },
  };
}

export function removePhoto({ photo }) {
  return {
    type: types.ROOM_REMOVE_PHOTO,
    payload: { photo },
  };
}

export function reset() {
  return {
    type: types.ROOM_RESET,
  };
}

export function startStream(stream) {
  return {
    type: types.ROOM_STREAM_START,
    payload: { stream },
  };
}
