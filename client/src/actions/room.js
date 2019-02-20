import * as types from './types';

export function join({ meta, peers }) {
  return {
    type: types.ROOM_JOIN,
    payload: { meta, peers },
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
