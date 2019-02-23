import * as types from './types';

export function addPhoto({ _id, origin, photo }) {
  return {
    type: types.ROOM_ADD_PHOTO,
    payload: { _id, origin, photo },
  };
}

export function movePhoto({ origin, photo }) {
  return {
    type: types.ROOM_MOVE_PHOTO,
    payload: { origin, photo },
  };
}

export function join({
  name,
  peers,
  photos,
  socket,
}) {
  return {
    type: types.ROOM_JOIN,
    payload: {
      name,
      peers,
      photos,
      socket,
    },
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

export function peerPointer({ peer, pointer }) {
  return {
    type: types.ROOM_PEER_POINTER,
    payload: { peer, pointer },
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
